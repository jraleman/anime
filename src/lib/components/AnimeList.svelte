<script lang="ts">
	import { animeStatusMap } from "$lib/utils/mappings";

    export let animeList;

    const getAnimeStatusColor = (status: string) => {
        return animeStatusMap[status].color;
    };

    const getAnimeStatusLabel = (status: string) => {
        return animeStatusMap[status].label;
    };

</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-8 mx-auto max-w-screen-xl lg:py-16 justify-items-center">
    {#each $animeList as anime}    
        <div class="card bg-neutral w-72 shadow-xl">
            <div class="full-width rounded-t-xl text-center p-1 text-gray-900 bg-{getAnimeStatusColor(anime.list_status.status)}">
                {getAnimeStatusLabel(anime.list_status.status)}
            </div>
            <figure>
                <img
                    class="size-full"
                    src={anime.node.main_picture.large} 
                    alt={anime.node.title}
                />
            </figure>
            <div class="card-body">
                <h2 class="card-title">
                    {anime.node.title}
                </h2>
                <div class="badge badge-primary">
                    Eps. {anime.node.num_episodes}
                </div>
                <div>
                    {#each anime.node.genres as genre}
                    <kbd class="kbd kbd-md">{genre.name}</kbd>
                    {/each}
                </div>
                <button on:click={() => alert(anime.node.synopsis)} class="btn btn-primary">
                    Synopsis
                </button>
            </div>
        </div>
    {/each}
</div>