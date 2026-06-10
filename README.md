# ANIME — アニメ視聴記録

A manga print-zine styled **personalized anime list viewer**, built as a fully static app
for GitHub Pages. Everything on the site is one MyAnimeList user's own anime list — their
recently seen anime, their top rated, their current-season titles, and search within their
list — with stats and a genre breakdown computed from it. This is by design: the site is a
personal watch log, not a general catalog browser, and should stay that way.

It runs entirely in the browser — **no build step, no server, no configuration**. The only
data fetched is the user's anime list, in a single MAL API v2 request (cached per username;
every view is a client-side sort/filter of it). The API is used with a public client ID (the
`MAL_CLIENT_ID` constant in `js/api.js` — register your own at
[myanimelist.net/apiconfig](https://myanimelist.net/apiconfig) if you fork this). MAL sends
no CORS headers, so requests go through [corsproxy.io](https://corsproxy.io), which is free
for browser-originated requests and forwards the client-ID header.

> This app replaced the original SvelteKit + MAL OAuth implementation that previously lived
> in this repo — see the git history if you need it.

## Features

- **My List** (default) — the anime they've completed, most recently watched first
- **Top Rated** — the same completed anime, best MAL score first
- **This Season** — entries from their list airing this season, any status (watching,
  plan-to-watch, …)
- **Search** — matches by title (or exact genre name) across their whole list, any status
- **Username switcher** — the field in the header changes whose list the whole site shows
  (the default is the `DEFAULT_USERNAME` constant in `js/app.js`, remembered in
  `localStorage`); the page chrome — hero tagline, loading/empty states, tab title — speaks
  about that viewer
- **Lazy loading** — no pagination; cards render in chunks of 24 as you scroll
  (IntersectionObserver), ending with a 完 marker
- **Full-list stats** — title count, mean score, total episodes, and the genre split doughnut
  are computed over each view's complete result set, never just the visible cards — the side
  panel says what's covered
- **Detail modal** — synopsis, facts (including their list status, episodes seen, and
  personal score), genres, and a link to MyAnimeList

## Tech

| Layer  | Tool                                           |
| ------ | ---------------------------------------------- |
| Markup | Plain HTML, no framework                       |
| Styles | Hand-rolled CSS (custom properties, no build)  |
| Logic  | Vanilla ES2022 JavaScript                      |
| Charts | [Chart.js](https://www.chartjs.org) via CDN    |
| Data   | [MAL API v2](https://myanimelist.net/apiconfig/references/api/v2) via [corsproxy.io](https://corsproxy.io) |

## Run locally

It's static — any file server works:

```bash
npx serve
# or
python3 -m http.server 8080
```

## Deploy to GitHub Pages

The app lives at the repo root and all paths are relative, so it works at any subpath
(`https://<user>.github.io/<repo>/`). In the repo settings:

*Pages → Source: Deploy from a branch → `main` / `/ (root)`*

The `.nojekyll` file is already in place so GitHub serves the files as-is.

## Credits

Data from the [MyAnimeList](https://myanimelist.net) API.
Fonts: Anton, Hanken Grotesk, IBM Plex Mono, Noto Sans JP (Google Fonts).
