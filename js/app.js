/**
 * ANIME — app state, rendering, and interactions.
 *
 * The site is a personalized list viewer: the viewer's entire MAL anime list
 * is fetched once (and cached per username), and every view — My List, Top
 * Rated, This Season, Search — is a client-side sort/filter of it. Stats and
 * the genre chart are computed over each view's full result set, while cards
 * render lazily in chunks as the grid sentinel scrolls into view.
 */
(() => {
  'use strict';

  // ── Views ────────────────────────────────────────────────

  // Default viewer shown before someone enters their own MAL username.
  const DEFAULT_USERNAME = 'DeskCanSaw';
  const USERNAME_KEY = 'anime:username';
  const RENDER_CHUNK = 24;

  const NOW_SEASON = (() => {
    const now = new Date();
    const season = ['winter', 'spring', 'summer', 'fall'][Math.floor(now.getMonth() / 3)];
    return { year: now.getFullYear(), season, label: `${season} ${now.getFullYear()}` };
  })();

  const completed = (list) => list.filter((a) => a.user_status?.status === 'completed');
  const byScore = (list) => [...list].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  // Every view derives from the viewer's list, already sorted by last updated.
  const VIEWS = {
    mylist: {
      title: (state) => `Seen by ${state.username}`,
      note: (state) => `Stats cover ${state.username}'s completed anime.`,
      empty: (state) => `該当なし — ${state.username} hasn't completed any anime yet`,
      items: (list) => completed(list)
    },
    top: {
      title: () => 'Top Rated',
      note: (state) => `Stats cover ${state.username}'s completed anime, best first.`,
      empty: (state) => `該当なし — ${state.username} hasn't completed any anime yet`,
      items: (list) => byScore(completed(list))
    },
    seasonal: {
      title: () => 'This Season',
      note: (state) =>
        `Stats cover the ${NOW_SEASON.label} titles in ${state.username}'s list, any status.`,
      empty: (state) => `該当なし — nothing from ${NOW_SEASON.label} in ${state.username}'s list`,
      items: (list) =>
        byScore(list.filter((a) => a.season === NOW_SEASON.season && a.year === NOW_SEASON.year))
    },
    search: {
      title: (state) => `Search: ${state.query}`,
      note: (state) => `Stats cover the matches in ${state.username}'s list, any status.`,
      empty: (state) => `該当なし — no “${state.query}” in ${state.username}'s list`,
      items: (list, state) => {
        const query = state.query.toLowerCase();
        return list.filter(
          (a) =>
            a.title.toLowerCase().includes(query) ||
            (a.genres ?? []).some((g) => g.name.toLowerCase() === query)
        );
      }
    }
  };

  const state = {
    view: 'mylist',
    query: '',
    username: localStorage.getItem(USERNAME_KEY) || DEFAULT_USERNAME,
    items: [], // current view's result set
    rendered: 0, // cards currently in the grid
    target: RENDER_CHUNK, // cards the user has scrolled for
    complete: false, // result set ready to render
    requestId: 0
  };

  // The one dataset everything derives from, cached per username.
  let cache = { username: null, list: [] };

  // ── DOM ──────────────────────────────────────────────────

  const $ = (id) => document.getElementById(id);

  const el = {
    tabs: document.querySelectorAll('.tab'),
    searchForm: $('search-form'),
    searchInput: $('search-input'),
    userForm: $('user-form'),
    userInput: $('user-input'),
    heroTagline: $('hero-tagline'),
    loadingText: $('loading-text'),
    resultsTitle: $('results-title'),
    grid: $('grid'),
    loading: $('loading'),
    error: $('error'),
    errorMessage: $('error-message'),
    retry: $('retry'),
    sentinel: $('sentinel'),
    listEnd: $('list-end'),
    statCount: $('stat-count'),
    statScore: $('stat-score'),
    statEpisodes: $('stat-episodes'),
    genreLegend: $('genre-legend'),
    panelNote: $('panel-note'),
    modal: $('modal'),
    modalClose: $('modal-close'),
    modalImage: $('modal-image'),
    modalScore: $('modal-score'),
    modalKicker: $('modal-kicker'),
    modalTitle: $('modal-title'),
    modalFacts: $('modal-facts'),
    modalGenres: $('modal-genres'),
    modalSynopsis: $('modal-synopsis'),
    modalLink: $('modal-link')
  };

  // ── Genre chart ──────────────────────────────────────────

  const CHART_PALETTE = [
    '#e63b2e',
    '#181410',
    '#f2b705',
    '#3a6ea5',
    '#c22418',
    '#7a7265',
    '#e8835a',
    '#4a443c',
    '#a5b53a',
    '#d9c8a9'
  ];

  let genreChart = null;

  const renderGenreChart = (items) => {
    const counts = new Map();
    for (const anime of items) {
      for (const genre of anime.genres ?? []) {
        counts.set(genre.name, (counts.get(genre.name) ?? 0) + 1);
      }
    }

    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    const total = top.reduce((sum, [, count]) => sum + count, 0);

    genreChart?.destroy();
    genreChart = new Chart($('genre-chart'), {
      type: 'doughnut',
      data: {
        labels: top.map(([name]) => name),
        datasets: [
          {
            data: top.map(([, count]) => count),
            backgroundColor: CHART_PALETTE,
            borderColor: '#181410',
            borderWidth: 2,
            hoverOffset: 8
          }
        ]
      },
      options: {
        cutout: '58%',
        plugins: { legend: { display: false } }
      }
    });

    el.genreLegend.replaceChildren(
      ...top.map(([name, count], i) => {
        const li = document.createElement('li');
        const swatch = document.createElement('i');
        swatch.className = 'swatch';
        swatch.style.background = CHART_PALETTE[i];
        const label = document.createElement('span');
        label.textContent = name;
        const pct = document.createElement('span');
        pct.className = 'pct';
        pct.textContent = `${Math.round((count / total) * 100)}%`;
        li.append(swatch, label, pct);
        return li;
      })
    );
  };

  // ── Stats ────────────────────────────────────────────────

  const renderStats = (items) => {
    const scored = items.filter((a) => a.score);
    const meanScore = scored.length
      ? (scored.reduce((sum, a) => sum + a.score, 0) / scored.length).toFixed(2)
      : '—';
    const episodes = items.reduce((sum, a) => sum + (a.episodes ?? 0), 0);

    el.statCount.textContent = items.length ? items.length.toLocaleString() : '—';
    el.statScore.textContent = meanScore;
    el.statEpisodes.textContent = episodes ? episodes.toLocaleString() : '—';
  };

  const resetStats = () => {
    el.statCount.textContent = '…';
    el.statScore.textContent = '…';
    el.statEpisodes.textContent = '…';
    el.panelNote.textContent = 'Loading the list…';
    genreChart?.destroy();
    genreChart = null;
    el.genreLegend.replaceChildren();
  };

  // ── Cards ────────────────────────────────────────────────

  const cardMeta = (anime) =>
    [
      anime.type,
      anime.episodes ? `${anime.episodes} EP` : null,
      anime.year,
      anime.user_status?.num_episodes_watched
        ? `${anime.user_status.num_episodes_watched} SEEN`
        : null
    ]
      .filter(Boolean)
      .join(' · ');

  const buildCard = (anime, stagger) => {
    const li = document.createElement('li');
    li.className = 'card';
    li.style.setProperty('--i', Math.min(stagger, 12));

    const btn = document.createElement('button');
    btn.className = 'card__btn';
    btn.type = 'button';
    btn.addEventListener('click', () => openModal(anime));

    const media = document.createElement('div');
    media.className = 'card__media';

    const img = document.createElement('img');
    img.src = anime.images?.jpg?.large_image_url ?? '';
    img.alt = '';
    img.loading = 'lazy';
    media.append(img);

    if (anime.rank) {
      const rank = document.createElement('span');
      rank.className = 'card__rank';
      rank.textContent = `#${anime.rank}`;
      media.append(rank);
    }

    if (anime.score) {
      const score = document.createElement('span');
      score.className = 'card__score';
      score.textContent = `★ ${anime.score.toFixed(2)}`;
      media.append(score);
    }

    const body = document.createElement('div');
    body.className = 'card__body';

    const title = document.createElement('h3');
    title.className = 'card__title';
    title.textContent = anime.title;

    const meta = document.createElement('p');
    meta.className = 'card__meta';
    meta.textContent = cardMeta(anime);

    const genres = document.createElement('ul');
    genres.className = 'card__genres';
    for (const genre of (anime.genres ?? []).slice(0, 3)) {
      const tag = document.createElement('li');
      tag.textContent = genre.name;
      genres.append(tag);
    }

    body.append(title, meta, genres);
    btn.append(media, body);
    li.append(btn);
    return li;
  };

  /** Append cards up to whichever is smaller: scroll target or result count. */
  const fillGrid = () => {
    const until = Math.min(state.target, state.items.length);
    if (state.rendered < until) {
      const fragment = document.createDocumentFragment();
      for (let i = state.rendered; i < until; i++) {
        fragment.append(buildCard(state.items[i], i - state.rendered));
      }
      state.rendered = until;
      el.grid.append(fragment);
      // re-observe so a sentinel that never left the viewport fires again
      observer.unobserve(el.sentinel);
      observer.observe(el.sentinel);
    }
    updateTail();
  };

  const renderEmpty = () => {
    const empty = document.createElement('li');
    empty.className = 'grid__empty';
    empty.textContent = VIEWS[state.view].empty(state);
    el.grid.replaceChildren(empty);
  };

  /** Show the sentinel while there's more to render, 完 when done. */
  const updateTail = () => {
    const allRendered = state.complete && state.rendered >= state.items.length;
    el.sentinel.hidden = allRendered || !el.loading.hidden || !el.error.hidden;
    el.listEnd.hidden = !(allRendered && state.items.length > 0);
  };

  // ── Lazy loading ─────────────────────────────────────────

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      state.target = state.rendered + RENDER_CHUNK;
      fillGrid();
    },
    { rootMargin: '600px' }
  );

  observer.observe(el.sentinel);

  // ── Modal ────────────────────────────────────────────────

  const openModal = (anime) => {
    el.modalImage.src = anime.images?.jpg?.large_image_url ?? '';
    el.modalImage.alt = `Cover art for ${anime.title}`;
    el.modalScore.textContent = anime.score ? `★ ${anime.score.toFixed(2)}` : 'NOT RATED';
    el.modalKicker.textContent = anime.rank ? `RANK #${anime.rank}` : '';
    el.modalTitle.textContent = anime.title;

    const facts = [
      ['Type', anime.type],
      ['Episodes', anime.episodes],
      ['Status', anime.status],
      ['Season', anime.season && anime.year ? `${anime.season} ${anime.year}` : null],
      ['Members', anime.members?.toLocaleString()],
      ['In Their List', anime.user_status?.status?.replaceAll('_', ' ')],
      ['Eps Seen', anime.user_status?.num_episodes_watched || null],
      ['Their Score', anime.user_status?.score || null]
    ].filter(([, value]) => value != null && value !== '');

    el.modalFacts.replaceChildren(
      ...facts.map(([label, value]) => {
        const li = document.createElement('li');
        const b = document.createElement('b');
        b.textContent = `${label.toUpperCase()} `;
        li.append(b, String(value));
        return li;
      })
    );

    el.modalGenres.replaceChildren(
      ...(anime.genres ?? []).map((genre) => {
        const li = document.createElement('li');
        li.textContent = genre.name;
        return li;
      })
    );

    el.modalSynopsis.textContent = anime.synopsis ?? 'No synopsis available.';
    el.modalLink.href = anime.url;
    el.modal.showModal();
  };

  el.modalClose.addEventListener('click', () => el.modal.close());
  el.modal.addEventListener('click', (event) => {
    // close when clicking the backdrop (outside the panel)
    if (event.target === el.modal) el.modal.close();
  });

  // ── Load + view switching ────────────────────────────────

  /** Username-dependent page chrome. */
  const applyChrome = () => {
    el.heroTagline.textContent = `─ the watch log of ${state.username} — via the MyAnimeList API`;
    el.loadingText.textContent = `FETCHING ${state.username.toUpperCase()}'S LIST`;
    document.title = `ANIME — ${state.username}'s watch log`;
  };

  /** The viewer's full list, fetched once and reused across views. */
  const ensureList = async () => {
    if (cache.username !== state.username) {
      cache = { username: state.username, list: await MalApi.userList(state.username) };
    }
    return cache.list;
  };

  const load = async () => {
    const requestId = ++state.requestId;

    state.items = [];
    state.rendered = 0;
    state.target = RENDER_CHUNK;
    state.complete = false;

    el.loading.hidden = false;
    el.error.hidden = true;
    el.sentinel.hidden = true;
    el.listEnd.hidden = true;
    el.grid.replaceChildren();
    applyChrome();
    el.resultsTitle.textContent = VIEWS[state.view].title(state);
    resetStats();
    window.scrollTo({ top: 0 });

    try {
      const list = await ensureList();
      if (requestId !== state.requestId) return; // superseded by a newer request

      state.items = VIEWS[state.view].items(list, state);
      state.complete = true;

      el.loading.hidden = true;
      if (state.items.length) {
        fillGrid();
      } else {
        renderEmpty();
        updateTail();
      }
      renderStats(state.items);
      renderGenreChart(state.items);
      el.panelNote.textContent = VIEWS[state.view].note(state);
    } catch (err) {
      if (requestId !== state.requestId) return;
      el.loading.hidden = true;
      el.sentinel.hidden = true;
      el.error.hidden = false;
      el.errorMessage.textContent = err.message;
    }
  };

  el.retry.addEventListener('click', load);

  const setView = (view) => {
    state.view = view;
    el.tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.view === view));
    load();
  };

  el.tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.dataset.view !== state.view) setView(tab.dataset.view);
    });
  });

  el.searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = el.searchInput.value.trim();
    if (!query) return;
    state.query = query;
    setView('search');
  });

  el.userForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = el.userInput.value.trim();
    if (!username || username === state.username) return;
    state.username = username;
    localStorage.setItem(USERNAME_KEY, username);
    el.userInput.blur();
    load(); // every view is this user's list — stay on the current one
  });

  // ── Go ───────────────────────────────────────────────────

  el.userInput.value = state.username;
  load();
})();
