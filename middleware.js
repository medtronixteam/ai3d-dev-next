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
      background: #fff7fb;
      color: #1a1a1a;
      font-family: "Segoe UI", sans-serif;
    }
    main {
      width: min(440px, calc(100% - 32px));
      text-align: center;
      background: #fff;
      border: 1px solid rgba(222, 57, 150, 0.18);
      border-radius: 20px;
      padding: 36px 28px;
      box-shadow: 0 16px 40px rgba(222, 57, 150, 0.12);
    }
    h1 { margin: 0 0 10px; font-size: 28px; }
    p { margin: 0; color: #5c5c66; line-height: 1.5; }
  </style>
</head>
<body>
  <main>
    <h1>Under maintenance</h1>
    <p>This site is temporarily unavailable. Please check back later.</p>
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
