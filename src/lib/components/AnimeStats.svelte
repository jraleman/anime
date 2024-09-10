<script lang="ts">
    export let animeList;

    let completedAnimes = 0;
    let pendingAnimes = 0;
    let totalAnimes = 0;
  
    let completedEpisodes = 0;
    let totalEpisodes = 0;

    if ($animeList) {
        $animeList.forEach((anime: any) => {
            const status = anime.list_status.status;
            if (status === 'completed' || status === 'dropped') {
              completedAnimes += 1;
              completedEpisodes += anime.node.num_episodes;
            }
            if (status === 'watching' || status === 'on_hold' || status === 'plan_to_watch') {
              pendingAnimes += 1;
            }
            totalEpisodes += anime.node.num_episodes;
            totalAnimes += 1;
        });
    }
</script>

<div class="text-center">
    <div class="stats shadow">
        <div class="stat bg-gray-800">
          <div class="stat-figure text-secondary bg-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21.856 10.303c.086.554.144 1.118.144 1.697 0 6.075-4.925 11-11 11s-11-4.925-11-11 4.925-11 11-11c2.347 0 4.518.741 6.304 1.993l-1.422 1.457c-1.408-.913-3.082-1.45-4.882-1.45-4.962 0-9 4.038-9 9s4.038 9 9 9c4.894 0 8.879-3.928 8.99-8.795l1.866-1.902zm-.952-8.136l-9.404 9.639-3.843-3.614-3.095 3.098 6.938 6.71 12.5-12.737-3.096-3.096z"/></svg>
          </div>
          <div class="stat-title">Completed</div>
          <div class="stat-value">{completedAnimes}</div>
          <div class="stat-desc">of {totalAnimes}</div>
        </div>
      
        <div class="stat bg-gray-800">
          <div class="stat-figure text-secondary bg-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18.513 7.119c.958-1.143 1.487-2.577 1.487-4.036v-3.083h-16v3.083c0 1.459.528 2.892 1.487 4.035l3.087 3.68c.566.677.57 1.625.009 2.306l-3.13 3.794c-.937 1.136-1.453 2.555-1.453 3.995v3.107h16v-3.107c0-1.44-.517-2.858-1.453-3.994l-3.13-3.794c-.562-.681-.558-1.629.009-2.306l3.087-3.68zm-.513-4.12c0 1.101-.363 2.05-1.02 2.834l-.978 1.167h-8.004l-.978-1.167c-.66-.785-1.02-1.736-1.02-2.834h12zm-.996 15.172c.652.791.996 1.725.996 2.829h-1.061c-1.939-2-4.939-2-4.939-2s-3 0-4.939 2h-1.061c0-1.104.344-2.039.996-2.829l3.129-3.793c.342-.415.571-.886.711-1.377h.164v1h2v-1h.163c.141.491.369.962.711 1.376l3.13 3.794zm-6.004-1.171h2v1h-2v-1zm0-2h2v1h-2v-1z"/></svg>
          </div>
          <div class="stat-title">Pending</div>
          <div class="stat-value">{pendingAnimes}</div>
          <div class="stat-desc">of {totalAnimes}</div>
        </div>
      
        <div class="stat bg-gray-800">
          <div class="stat-figure text-secondary bg-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.266 7l12.734-2.625-.008-.042-1.008-4.333-21.169 4.196c-1.054.209-1.815 1.134-1.815 2.207v14.597c0 1.657 1.343 3 3 3h18c1.657 0 3-1.343 3-3v-14h-12.734zm8.844-5.243l2.396 1.604-2.994.595-2.398-1.605 2.996-.594zm-5.898 1.169l2.4 1.606-2.994.595-2.401-1.607 2.995-.594zm-5.904 1.171l2.403 1.608-2.993.595-2.406-1.61 2.996-.593zm-2.555 5.903l2.039-2h3.054l-2.039 2h-3.054zm4.247 10v-7l6 3.414-6 3.586zm4.827-10h-3.054l2.039-2h3.054l-2.039 2zm6.012 0h-3.054l2.039-2h3.054l-2.039 2z"/></svg>
          </div>
          <div class="stat-title">Episodes</div>
          <div class="stat-value">{completedEpisodes}</div>
          <div class="stat-desc">of {totalEpisodes}</div>
        </div>
      </div>
</div>