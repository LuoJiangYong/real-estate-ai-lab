const DEFAULT_ALLOWED_ORIGINS = [
  'http://coskyai.com',
  'https://coskyai.com',
  'http://www.coskyai.com',
  'https://www.coskyai.com'
];

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return withCors(request, new Response(null, { status: 204 }), env);
    }

    if (request.method !== 'POST') {
      return withCors(request, json({ ok: false, error: 'method_not_allowed' }, 405), env);
    }

    const upstreamUrl = env.CONTACT_FORM_UPSTREAM_URL;
    if (!upstreamUrl) {
      return withCors(request, json({ ok: false, error: 'missing_upstream_url' }, 500), env);
    }

    let payload;
    try {
      payload = await request.json();
    } catch (error) {
      return withCors(request, json({ ok: false, error: 'invalid_json' }, 400), env);
    }

    const validationError = validatePayload(payload);
    if (validationError) {
      return withCors(request, json({ ok: false, error: validationError }, 400), env);
    }

    const normalizedPayload = {
      name: String(payload.name || '').trim(),
      email: String(payload.email || '').trim(),
      message: String(payload.message || '').trim(),
      source: String(payload.source || ''),
      createdAt: String(payload.createdAt || new Date().toISOString())
    };

    const forwarding = forwardToUpstream(upstreamUrl, normalizedPayload);
    if (ctx && typeof ctx.waitUntil === 'function') {
      ctx.waitUntil(forwarding);
    } else {
      await forwarding;
    }

    return withCors(request, json({ ok: true, queued: true }), env);
  }
};

async function forwardToUpstream(upstreamUrl, payload) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort('upstream_timeout'), 9000);

    try {
      const upstreamResponse = await fetch(upstreamUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      const upstreamText = await upstreamResponse.text();
      let upstreamBody = {};
      try {
        upstreamBody = JSON.parse(upstreamText);
      } catch (error) {
        upstreamBody = { raw: upstreamText };
      }

      if (!upstreamResponse.ok || upstreamBody.ok === false) {
        throw new Error(`upstream_failed:${upstreamResponse.status}:${JSON.stringify(upstreamBody)}`);
      }

      return upstreamBody;
    } catch (error) {
      console.error('contact_form_forward_failed', error && error.message ? error.message : error);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
}

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') return 'invalid_payload';
  if (!payload.email || !String(payload.email).includes('@')) return 'email_required';
  if (!payload.message || !String(payload.message).trim()) return 'message_required';
  return '';
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
}

function withCors(request, response, env) {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  const headers = new Headers(response.headers);

  headers.set('Access-Control-Allow-Origin', allowedOrigin);
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  headers.set('Access-Control-Max-Age', '86400');
  headers.set('Vary', 'Origin');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function parseAllowedOrigins(value) {
  if (!value) return DEFAULT_ALLOWED_ORIGINS;
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}
