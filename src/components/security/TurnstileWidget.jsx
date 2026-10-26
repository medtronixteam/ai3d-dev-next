'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAFmPffq1_87uW0av';

const TurnstileWidget = forwardRef(function TurnstileWidget({ onToken, theme = 'auto' }, ref) {
  const hostRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useImperativeHandle(ref, () => ({
    reset() {
      onTokenRef.current?.('');
      if (widgetIdRef.current != null && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
  }));

  useEffect(() => {
    let removed = false;

    const renderWidget = () => {
      if (removed || !hostRef.current || !window.turnstile || widgetIdRef.current != null) return;
      const resolvedTheme =
        theme === 'auto'
          ? document.documentElement.getAttribute('data-theme') === 'dark'
            ? 'dark'
            : 'light'
          : theme;
      widgetIdRef.current = window.turnstile.render(hostRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: resolvedTheme,
        callback: (token) => onTokenRef.current?.(token),
        'expired-callback': () => onTokenRef.current?.(''),
        'error-callback': () => onTokenRef.current?.(''),
      });
    };

    renderWidget();
    const timer = window.setInterval(renderWidget, 200);

    return () => {
      removed = true;
      window.clearInterval(timer);
      if (widgetIdRef.current != null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [theme]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 16px' }}>
      <div ref={hostRef} className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />
    </div>
  );
});

export async function verifyTurnstile(token) {
  if (!token) return false;
  const res = await fetch('/api/turnstile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  const data = await res.json().catch(() => ({}));
  return res.ok && data.success === true;
}

export default TurnstileWidget;
