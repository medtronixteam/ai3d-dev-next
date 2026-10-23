import { NextResponse } from 'next/server';

const DEV_HOST = 'ai3d-dev-next.ai3dscanning.com';
const GATE_CODE = 'R7mQ4kL9pX2vN8wT';
const GATE_COOKIE = 'a3d_dev_gate';

function todayKarachi() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function secondsUntilKarachiMidnight(today) {
  const [year, month, day] = today.split('-').map(Number);
  const nextMidnightUtc = Date.UTC(year, month - 1, day, 19, 0, 0);
  return Math.max(Math.floor((nextMidnightUtc - Date.now()) / 1000), 60);
}

function requestHost(request) {
  const forwarded = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  return forwarded.split(',')[0].trim().split(':')[0].toLowerCase();
}

function readGate(request) {
  const params = request.nextUrl.searchParams;
  let code = params.get('s');
  let date = params.get('date');

  if (!code || !date) {
    const path = decodeURIComponent(request.nextUrl.pathname);
    const match = path.match(/^\/s=([^&/]+)&date=([^&/]+)/);
    if (match) {
      code = decodeURIComponent(match[1]);
      date = decodeURIComponent(match[2]);
    }
  }

  return { code, date };
}

function gateValue(today) {
  return `${GATE_CODE}.${today}`;
}

function maintenanceResponse() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Under maintenance</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      color: #1a1a1a;
      font-family: "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at 20% 20%, rgba(222, 57, 150, 0.16), transparent 32%),
        radial-gradient(circle at 80% 80%, rgba(222, 57, 150, 0.12), transparent 28%),
        #fff7fb;
      overflow: hidden;
    }
    .glow {
      position: fixed;
      width: 280px;
      height: 280px;
      border-radius: 50%;
      background: rgba(222, 57, 150, 0.16);
      filter: blur(20px);
      animation: drift 8s ease-in-out infinite;
      pointer-events: none;
    }
    .glow-a { top: 8%; left: 12%; }
    .glow-b { right: 8%; bottom: 10%; animation-delay: -4s; }
    main {
      position: relative;
      width: min(460px, 100%);
      text-align: center;
      background: #fff;
      border: 1px solid rgba(222, 57, 150, 0.16);
      border-radius: 28px;
      padding: 42px 32px 36px;
      box-shadow: 0 24px 60px rgba(222, 57, 150, 0.14);
      animation: rise 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .badge {
      position: relative;
      width: 92px;
      height: 92px;
      margin: 0 auto 22px;
    }
    .ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px dashed rgba(222, 57, 150, 0.45);
      animation: spin 12s linear infinite;
    }
    .icon {
      position: absolute;
      inset: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: linear-gradient(180deg, #ff5eae 0%, #de3996 100%);
      color: #fff;
      box-shadow: 0 12px 24px rgba(222, 57, 150, 0.32);
      animation: pulse 2.4s ease-in-out infinite;
    }
    .icon svg { width: 36px; height: 36px; }
    h1 { margin: 0 0 10px; font-size: 30px; letter-spacing: -0.4px; }
    p { margin: 0 auto; max-width: 320px; color: #5c5c66; line-height: 1.55; }
    .dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 22px;
    }
    .dots span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #de3996;
      animation: bounce 1.2s ease-in-out infinite;
    }
    .dots span:nth-child(2) { animation-delay: 0.15s; }
    .dots span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes rise {
      from { opacity: 0; transform: translateY(16px) scale(0.98); }
      to { opacity: 1; transform: none; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.06); }
    }
    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
      40% { transform: translateY(-6px); opacity: 1; }
    }
    @keyframes drift {
      0%, 100% { transform: translate3d(0, 0, 0); }
      50% { transform: translate3d(18px, -16px, 0); }
    }
    @media (prefers-reduced-motion: reduce) {
      .glow, .ring, .icon, .dots span, main { animation: none; }
    }
  </style>
</head>
<body>
  <div class="glow glow-a"></div>
  <div class="glow glow-b"></div>
  <main>
    <div class="badge" aria-hidden="true">
      <span class="ring"></span>
      <span class="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.3-2.3 2.1-2.1z"/>
          <path d="M16 8l2 2"/>
        </svg>
      </span>
    </div>
    <h1>Under maintenance</h1>
    <p>This site is temporarily unavailable. Please check back later.</p>
    <div class="dots" aria-hidden="true"><span></span><span></span><span></span></div>
  </main>
</body>
</html>`;

  return new NextResponse(html, {
    status: 503,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

export function middleware(request) {
  if (requestHost(request) !== DEV_HOST) {
    return NextResponse.next();
  }

  const today = todayKarachi();
  const path = decodeURIComponent(request.nextUrl.pathname);
  const openedFromPath = /^\/s=[^&/]+&date=[^&/]+/.test(path);
  const cookie = request.cookies.get(GATE_COOKIE)?.value;

  if (cookie === gateValue(today) && !openedFromPath && !request.nextUrl.searchParams.has('s')) {
    return NextResponse.next();
  }

  const { code, date } = readGate(request);
  if (code === GATE_CODE && date === today) {
    const url = request.nextUrl.clone();
    if (openedFromPath) url.pathname = '/';
    url.searchParams.delete('s');
    url.searchParams.delete('date');
    const response = NextResponse.redirect(url);
    response.cookies.set(GATE_COOKIE, gateValue(today), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: secondsUntilKarachiMidnight(today),
    });
    return response;
  }

  return maintenanceResponse();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
