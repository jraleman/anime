# Anime

A SvelteKit web app that connects to your [MyAnimeList](https://myanimelist.net) account via the MAL API v2 and visualizes your anime list with stats, a genre breakdown chart, and a browsable card grid.

## Features

- **Anime Stats** — shows completed, pending, and total episode counts
- **Genre Chart** — doughnut chart breaking down genres across your entire list
- **Anime Cards** — responsive grid with status badges, genre tags, episode count, and a synopsis modal
- Deployed on [Render](https://render.com) as a Node.js web service

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | [SvelteKit](https://kit.svelte.dev) |
| Styling | [Tailwind CSS](https://tailwindcss.com) + [DaisyUI](https://daisyui.com) |
| Charts | [Chart.js](https://www.chartjs.org) via [svelte-chartjs](https://github.com/SauravKanchan/svelte-chartjs) |
| HTTP client | [Axios](https://axios-http.com) |
| Adapter | `@sveltejs/adapter-node` |
| Testing | Playwright (integration) + Vitest (unit) |

## Environment Variables

Create a `.env` file at the project root:

```env
PUBLIC_MAL_BASE_URL=https://api.myanimelist.net/v2
PUBLIC_MAL_USERNAME=your_mal_username
PRIVATE_MAL_CLIENT_ID=your_client_id
PRIVATE_MAL_CLIENT_SECRET=your_client_secret
```

You can obtain a client ID and secret by registering an application at [myanimelist.net/apiconfig](https://myanimelist.net/apiconfig).

## Getting Started

### Install dependencies

```bash
npm install
```

### Development

```bash
npm run dev

# open in browser automatically
npm run dev -- --open
```

### Build

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Lint & format

```bash
npm run lint
npm run format
```

### Tests

```bash
npm run test              # integration + unit
npm run test:integration  # Playwright
npm run test:unit         # Vitest
```

## API Routes

| Method | Path | Description |
|---|---|---|
| GET | `/api/anime/:username` | Fetches the full paginated anime list for a MAL user |
| GET | `/api/anime/stats` | Fetches anime statistics for the authenticated user |

## Project Structure

```
src/
  lib/
    api/
      myAnimeList.ts      # Axios client + MAL API helpers
    components/
      AnimeChart.svelte   # Genre doughnut chart
      AnimeList.svelte    # Card grid with synopsis modals
      AnimeStats.svelte   # Completed / pending / episode stats
      AppTitle.svelte
      ErrorIndicator.svelte
      LoadingIndicator.svelte
    utils/
      colors.ts           # Chart color palettes
      mappings.ts         # Status → label/color mappings
      requests.ts         # Client-side fetch wrappers
  routes/
    +page.svelte          # Main page
    api/anime/
      [username]/+server.ts
      stats/+server.ts
```

## Deployment

The app is configured for Render via `render.yaml`:

```yaml
buildCommand: npm install && npm run build
startCommand: node build/index.js
```

## References

- [MyAnimeList API v2 reference](https://myanimelist.net/apiconfig/references/api/v2)
