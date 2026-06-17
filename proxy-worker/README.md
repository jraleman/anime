# MAL CORS proxy worker

The MAL API sends no CORS headers, so the site needs a proxy. Public free
proxies keep disappearing (corsproxy.io started 403ing unregistered origins,
which broke the site), so the reliable setup is this ~40-line Cloudflare
Worker of your own. It only proxies GETs to `api.myanimelist.net`.

The static site itself is unaffected — this is a one-time, separate deploy,
not a build step.

## Deploy

**Dashboard (no tooling):** Cloudflare dashboard → *Workers & Pages → Create →
Worker*, name it (e.g. `mal-proxy`), paste in `worker.js`, *Deploy*. Note the
`https://mal-proxy.<your-subdomain>.workers.dev` URL.

**Or with wrangler:**

```bash
npx wrangler deploy proxy-worker/worker.js --name mal-proxy --compatibility-date 2026-06-11
```

## Point the app at it

In `js/api.js`, uncomment the first entry of `PROXIES` and fill in your
worker URL:

```js
(url) => 'https://mal-proxy.YOUR-SUBDOMAIN.workers.dev/?url=' + encodeURIComponent(url),
```

## Verify

```bash
curl -H "X-MAL-CLIENT-ID: <client id from js/api.js>" \
  "https://mal-proxy.<your-subdomain>.workers.dev/?url=https%3A%2F%2Fapi.myanimelist.net%2Fv2%2Fusers%2FDeskCanSaw%2Fanimelist%3Flimit%3D2"
```
