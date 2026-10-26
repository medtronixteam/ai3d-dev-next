export async function POST(request) {
  let token = '';
  try {
    const body = await request.json();
    token = body?.token || '';
  } catch {
    token = '';
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!token || !secret) {
    return Response.json({ success: false }, { status: 400 });
  }

  const payload = new URLSearchParams();
  payload.set('secret', secret);
  payload.set('response', token);
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for');
  if (ip) payload.set('remoteip', ip.split(',')[0].trim());

  try {
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload,
    });
    const result = await verify.json();
    if (!result.success) {
      return Response.json({ success: false }, { status: 400 });
    }
    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false }, { status: 502 });
  }
}
