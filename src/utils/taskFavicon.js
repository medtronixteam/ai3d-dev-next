const ORIGINAL_HREF = '/logo.png';
const DONE_COLOR = '#de3996';

let mode = 'idle';
let timer = null;
let logoImage = null;
let blinkOn = true;
let listenersReady = false;
let donePath = '';
let workingPath = '';

const loadLogo = () => {
  if (logoImage) return Promise.resolve(logoImage);
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      logoImage = image;
      resolve(image);
    };
    image.onerror = () => resolve(null);
    image.src = ORIGINAL_HREF;
  });
};

const iconLinks = () => {
  const links = Array.from(document.querySelectorAll('link[rel~="icon"]'));
  if (links.length) return links;
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  document.head.appendChild(link);
  return [link];
};

const paint = (dotColor) => {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx || !logoImage) return;
  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(logoImage, 0, -6, size, size + 8);
  if (dotColor) {
    const dotX = 50;
    const dotY = 50;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 11, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(dotX, dotY, 8, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();
  }
  const href = canvas.toDataURL('image/png');
  iconLinks().forEach((link) => {
    link.type = 'image/png';
    link.href = href;
  });
};

const restore = () => {
  iconLinks().forEach((link) => {
    link.type = 'image/png';
    link.href = ORIGINAL_HREF;
  });
};

const onRoute = () => {
  const path = window.location.pathname;
  if (mode === 'done' && path !== donePath) resetTaskFavicon();
  if (mode === 'working' && path !== workingPath) resetTaskFavicon();
};

const ensureListeners = () => {
  if (listenersReady || typeof window === 'undefined') return;
  listenersReady = true;
  const { pushState, replaceState } = window.history;
  window.history.pushState = function pushStateWithFavicon(...args) {
    const result = pushState.apply(this, args);
    onRoute();
    return result;
  };
  window.history.replaceState = function replaceStateWithFavicon(...args) {
    const result = replaceState.apply(this, args);
    onRoute();
    return result;
  };
  window.addEventListener('popstate', onRoute);
};

export const setFaviconWorking = () => {
  if (typeof document === 'undefined') return;
  ensureListeners();
  if (mode === 'working') return;
  mode = 'working';
  donePath = '';
  workingPath = window.location.pathname;
  window.clearInterval(timer);
  loadLogo().then(() => {
    if (mode !== 'working') return;
    blinkOn = true;
    const tick = () => {
      if (mode !== 'working') return;
      blinkOn = !blinkOn;
      paint(blinkOn ? DONE_COLOR : null);
    };
    tick();
    timer = window.setInterval(tick, 550);
  });
};

export const setFaviconDone = () => {
  if (typeof document === 'undefined' || mode !== 'working') return;
  window.clearInterval(timer);
  timer = null;
  mode = 'done';
  donePath = window.location.pathname;
  loadLogo().then(() => {
    if (mode !== 'done') return;
    paint(DONE_COLOR);
  });
};

export const resetTaskFavicon = () => {
  if (typeof document === 'undefined') return;
  mode = 'idle';
  donePath = '';
  workingPath = '';
  window.clearInterval(timer);
  timer = null;
  restore();
};
