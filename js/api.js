/**
 * MyAnimeList API v2 client.
 *
 * The site is a personalized list viewer: the only thing fetched is a user's
 * own anime list (every view is a sort/filter of it, done client-side). The
 * official MAL API is used with a public client ID; MAL sends no CORS headers,
 * so requests go through a CORS proxy (one that forwards the client-ID header).
 */
const MalApi = (() => {
  const MAL_BASE = 'https://api.myanimelist.net/v2';
  // Public client ID — safe to ship client-side: it only grants access to data
  // MAL already exposes publicly. Register your own at myanimelist.net/apiconfig.
  const MAL_CLIENT_ID = 'ebf2c8baf092b3f0631428e34b559aff';
  const LIST_PAGE_SIZE = 1000; // animelist max per request
  const MAX_RETRIES = 2;

  const FIELDS =
    'list_status,synopsis,genres,num_episodes,mean,rank,media_type,status,start_season,num_list_users';

  /**
   * CORS proxies, tried in order; the first that works is pinned for the
   * session. Free public proxies come and go — corsproxy.io, used previously,
   * now 403s requests from unregistered origins — so the durable option is
   * your own Cloudflare Worker (free tier is plenty): deploy
   * proxy-worker/worker.js per proxy-worker/README.md, then put it first here.
   */
  const PROXIES = [
    (url) => 'https://mal-proxy.jraleman-d82.workers.dev/?url=' + encodeURIComponent(url),
    (url) => 'https://test.cors.workers.dev/?' + url,
    (url) => 'https://corsproxy.io/?url=' + encodeURIComponent(url)
  ];
  let pinnedProxy = 0;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const buildUrl = (base, params = {}) => {
    const url = new URL(base);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    }
    return url.toString();
  };

  /**
   * GET via a CORS proxy, with a short retry on 429. A network failure or a
   * non-ok status other than 404 may be the proxy itself refusing (that's how
   * corsproxy.io died: 403 on everything), so those advance to the next proxy;
   * a 404 made it through to MAL and is the real answer.
   */
  const request = async (url) => {
    let lastError;
    for (let p = pinnedProxy; p < PROXIES.length; p++) {
      for (let attempt = 0; ; attempt++) {
        let response;
        try {
          response = await fetch(PROXIES[p](url), {
            headers: { 'X-MAL-CLIENT-ID': MAL_CLIENT_ID }
          });
        } catch {
          lastError = new Error('Could not reach the CORS proxy.');
          break;
        }

        if (response.status === 429 && attempt < MAX_RETRIES) {
          await sleep(1200 * (attempt + 1));
          continue;
        }
        if (response.status === 404) {
          throw new Error('Not found — check the username (the list may be private).');
        }
        if (!response.ok) {
          lastError = new Error(`API responded with ${response.status} ${response.statusText}`);
          break;
        }
        pinnedProxy = p;
        return response.json();
      }
    }
    throw lastError;
  };

  /** Reshape a MAL v2 list entry into the object the UI renders. */
  const fromMalEntry = ({ node, list_status }) => ({
    mal_id: node.id,
    title: node.title,
    title_english: null,
    title_japanese: null,
    type: (node.media_type ?? '').replace('_', ' ').toUpperCase() || null,
    episodes: node.num_episodes || null,
    score: node.mean ?? null,
    rank: node.rank ?? null,
    status: node.status?.replaceAll('_', ' ') ?? null,
    season: node.start_season?.season ?? null,
    year: node.start_season?.year ?? null,
    members: node.num_list_users ?? null,
    synopsis: node.synopsis || null,
    genres: node.genres ?? [],
    images: {
      jpg: { large_image_url: node.main_picture?.large ?? node.main_picture?.medium ?? '' }
    },
    url: `https://myanimelist.net/anime/${node.id}`,
    // the viewer's own list data (status, episodes watched, personal score, …)
    user_status: list_status ?? null
  });

  /**
   * Fetch a user's ENTIRE anime list (every status: watching, completed,
   * on-hold, dropped, plan-to-watch), most recently updated first. Usually a
   * single request — MAL serves up to 1000 entries at a time.
   */
  const userList = async (username) => {
    const items = [];
    for (let offset = 0; ; offset += LIST_PAGE_SIZE) {
      const { data, paging } = await request(
        buildUrl(`${MAL_BASE}/users/${encodeURIComponent(username)}/animelist`, {
          sort: 'list_updated_at',
          limit: LIST_PAGE_SIZE,
          offset,
          fields: FIELDS
        })
      );
      items.push(...(data ?? []).map(fromMalEntry));
      if (!paging?.next) return items;
    }
  };

  return { userList };
})();
