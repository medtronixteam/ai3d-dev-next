'use client';

import { createContext, forwardRef, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { usePathname, useRouter, useParams as useNextParams, useSearchParams as useNextSearchParams } from 'next/navigation';

const listeners = new Set();
let locationVersion = 0;

let navState = { path: '', value: undefined };

const guardSubscribers = new Set();

function emitLocation() {
  locationVersion += 1;
  listeners.forEach((listener) => listener());
}

let historyPatched = false;

function patchHistory() {
  if (historyPatched || typeof window === 'undefined') return;
  historyPatched = true;
  const wrap = (original) =>
    function patchedHistory(...args) {
      const result = original.apply(this, args);
      queueMicrotask(emitLocation);
      return result;
    };
  window.history.pushState = wrap(window.history.pushState);
  window.history.replaceState = wrap(window.history.replaceState);
  window.addEventListener('popstate', emitLocation);
}

function subscribeSearch(listener) {
  patchHistory();
  return subscribeLocation(listener);
}

function readSearch() {
  if (typeof window === 'undefined') return '';
  return window.location.search || '';
}

function subscribeLocation(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function toHref(to) {
  if (typeof to === 'string') return to || '/';
  if (to && typeof to === 'object') {
    return `${to.pathname || ''}${to.search || ''}${to.hash || ''}` || '/';
  }
  return '/';
}

function pathnameOf(href) {
  if (!href) return '/';
  const cut = href.split('#')[0].split('?')[0];
  return cut || '/';
}

function rememberState(path, value) {
  navState = { path, value };
  try {
    sessionStorage.setItem('rr-nav-state', JSON.stringify({ path, value }));
  } catch {
    /* ignore */
  }
  emitLocation();
}

function readState(path) {
  if (navState.path === path) return navState.value;
  try {
    const raw = sessionStorage.getItem('rr-nav-state');
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (parsed.path === path) {
      navState = { path, value: parsed.value };
      return parsed.value;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

const PARAM_PATTERNS = [
  [/^\/render\/model\/([^/]+)/, 'id'],
  [/^\/3dio\/asset\/([^/]+)/, 'slug'],
  [/^\/3dio\/workspace\/([^/]+)/, 'workspaceId'],
  [/^\/3dio\/team\/invite\/accept\/([^/]+)/, 'token'],
  [/^\/3dio\/new\/scan\/([^/]+)/, 'slug'],
  [/^\/3dio\/preview\/([^/]+)/, 'id'],
  [/^\/3dio\/splat-viewer\/([^/]+)/, 'id'],
  [/^\/3dio\/support-ticket-detail\/([^/]+)/, 'id'],
  [/^\/public\/project\/([^/]+)/, 'slug'],
  [/^\/project\/([^/]+)/, 'slug'],
  [/^\/3dio\/public\/([^/]+)/, 'slug'],
];

function decodeParam(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseParams(pathname) {
  const params = {};
  PARAM_PATTERNS.forEach(([pattern, key]) => {
    const match = pathname.match(pattern);
    if (match?.[1]) params[key] = decodeParam(match[1]);
  });
  return params;
}

function isExternal(href) {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

function runGuards(nextPathname, resume) {
  const guards = Array.from(guardSubscribers);
  for (let i = 0; i < guards.length; i += 1) {
    if (guards[i](nextPathname, resume)) return true;
  }
  return false;
}

export function useNavigate() {
  const router = useRouter();

  return (to, options = {}) => {
    if (typeof to === 'number') {
      if (to < 0) router.back();
      else router.forward();
      return;
    }

    const href = toHref(to);
    if (isExternal(href)) {
      if (options.replace) window.location.replace(href);
      else window.location.assign(href);
      return;
    }

    const path = pathnameOf(href);
    const go = () => {
      if (Object.prototype.hasOwnProperty.call(options, 'state')) {
        rememberState(path, options.state);
      } else {
        rememberState('', undefined);
      }
      const sameDocument =
        typeof window !== 'undefined' &&
        path === window.location.pathname &&
        options.replace &&
        !href.includes('#');
      const navOptions = { scroll: !sameDocument };
      if (options.replace) router.replace(href, navOptions);
      else router.push(href, navOptions);
    };

    if (!runGuards(path, go)) go();
  };
}

export function useLocation() {
  const pathname = usePathname() || '/';
  const version = useSyncExternalStore(subscribeLocation, () => locationVersion, () => 0);
  const search = useSyncExternalStore(subscribeSearch, readSearch, () => '');
  const [hash, setHash] = useState('');

  useEffect(() => {
    setHash(window.location.hash || '');
  }, [pathname, search, version]);

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash || '');
      emitLocation();
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return useMemo(
    () => ({
      pathname,
      search,
      hash,
      state: readState(pathname),
      key: `${pathname}${search}${hash}:${version}`,
    }),
    [pathname, search, hash, version],
  );
}

export function useParams() {
  const nextParams = useNextParams() || {};
  const pathname = usePathname() || '/';
  return useMemo(() => ({ ...nextParams, ...parseParams(pathname) }), [nextParams, pathname]);
}

export function useSearchParams() {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const searchParams = useNextSearchParams();

  const setSearchParams = (next, options = {}) => {
    const params = next instanceof URLSearchParams ? next : new URLSearchParams(next);
    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    if (options.replace) router.replace(href);
    else router.push(href);
  };

  return [searchParams, setSearchParams];
}

export function useBlocker(predicate) {
  const pathname = usePathname() || '/';
  const predicateRef = useRef(predicate);
  predicateRef.current = predicate;
  const proceedRef = useRef(() => {});
  const resetRef = useRef(() => {});
  const [state, setState] = useState('unblocked');

  useEffect(() => {
    const guard = (nextPathname, resume) => {
      let shouldBlock = false;
      try {
        shouldBlock = Boolean(
          predicateRef.current({
            currentLocation: { pathname: window.location.pathname || pathname },
            nextLocation: { pathname: nextPathname },
          }),
        );
      } catch {
        shouldBlock = false;
      }
      if (!shouldBlock) return false;
      proceedRef.current = () => {
        setState('unblocked');
        resume();
      };
      resetRef.current = () => setState('unblocked');
      setState('blocked');
      return true;
    };

    guardSubscribers.add(guard);
    return () => guardSubscribers.delete(guard);
  }, [pathname]);

  return useMemo(
    () => ({
      state,
      proceed: () => proceedRef.current(),
      reset: () => resetRef.current(),
    }),
    [state],
  );
}

export const Link = forwardRef(function Link(
  { to, href, replace, state, onClick, target, children, ...rest },
  ref,
) {
  const navigate = useNavigate();
  const dest = to ?? href ?? '';
  const url = typeof dest === 'string' ? dest : toHref(dest);
  const external = isExternal(url);

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (!url || external || target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    navigate(url, { replace, state });
  };

  return (
    <a ref={ref} href={url || undefined} target={target} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
});

function isNavActive(pathname, href, end) {
  const path = pathnameOf(href);
  const current = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const target = path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path;
  if (end || target === '/') return current === target;
  return current === target || current.startsWith(`${target}/`);
}

export const NavLink = forwardRef(function NavLink(
  { to, href, end, className, style, children, ...rest },
  ref,
) {
  const { pathname } = useLocation();
  const dest = to ?? href ?? '';
  const url = typeof dest === 'string' ? dest : toHref(dest);
  const active = isNavActive(pathname, url, end);
  const navState = { isActive: active, isPending: false };
  const resolvedClass =
    typeof className === 'function'
      ? className(navState)
      : [className, active ? 'active' : null].filter(Boolean).join(' ');
  const resolvedStyle = typeof style === 'function' ? style(navState) : style;
  const content = typeof children === 'function' ? children(navState) : children;

  return (
    <Link
      ref={ref}
      to={dest}
      className={resolvedClass}
      style={resolvedStyle}
      aria-current={active ? 'page' : undefined}
      {...rest}
    >
      {content}
    </Link>
  );
});

export function Navigate({ to, replace = false }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
  }, [to, replace]);
  return null;
}

const OutletContext = createContext(null);

export function OutletProvider({ outlet, children }) {
  return <OutletContext.Provider value={outlet}>{children}</OutletContext.Provider>;
}

export function Outlet() {
  return useContext(OutletContext);
}

export function useOutlet() {
  return Outlet();
}
