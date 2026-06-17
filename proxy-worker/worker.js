/**
 * Tiny CORS proxy for the MAL API, for Cloudflare Workers (the free tier's
 * 100k requests/day is far more than this site needs). It only proxies GETs
 * to api.myanimelist.net, so it can't be abused as an open proxy.
 *
 * Usage from the app: GET <worker-url>/?url=<encodeURIComponent(mal-url)>
 * with the X-MAL-CLIENT-ID header, which is forwarded to MAL.
 */

const ALLOWED_HOST = 'api.myanimelist.net';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'X-MAL-CLIENT-ID',
  'Access-Control-Max-Age': '86400'
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    let target;
    try {
      target = new URL(new URL(request.url).searchParams.get('url'));
    } catch {
      return new Response('Missing or invalid ?url=', { status: 400, headers: CORS_HEADERS });
    }
    if (target.hostname !== ALLOWED_HOST) {
      return new Response('Host not allowed', { status: 403, headers: CORS_HEADERS });
    }

    const upstream = await fetch(target, {
      headers: { 'X-MAL-CLIENT-ID': request.headers.get('X-MAL-CLIENT-ID') ?? '' }
    });
    const response = new Response(upstream.body, upstream);
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      response.headers.set(key, value);
    }
    return response;
  }
};
