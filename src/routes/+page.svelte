<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { PUBLIC_MAL_USERNAME } from "$env/static/public";

    let username = PUBLIC_MAL_USERNAME;
    let animeList = writable([]);
    let isLoading = writable(false);
    let error = writable();

    const fetchList = async () => {
        isLoading.set(true);
        error.set(null);
        try {
            const response = await fetch(`/api/anime/${username}`);
            if (!response.ok) {
                error.set('Error fetching anime list');
            }
            const data = await response.json();
            animeList.set(data);
            console.log({ data})
        } catch (err: any) {
            error.set(err.message);
        } finally {
            isLoading.set(false);
        }
    }

    onMount(() => {
        fetchList();
    })
</script>

<h1 class="mt-10 tracking-wide text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
    My Anime View List
</h1>

{#if $isLoading}
    <span class="loading loading-spinner loading-xs"></span>
{/if}

{#if $error}
    <p>{$error}</p>
{/if}

<div class="container mx-auto min-w-fit font-sans p-4 bg-base-500">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-8 mx-auto max-w-screen-xl lg:py-16 justify-items-center">
        {#each $animeList as anime}    
            <div class="card bg-gray-800 w-72 shadow-xl">
                <figure>
                <img
                    src={anime.node.main_picture.large} 
                    alt={anime.node.title}  
                />
                </figure>
                <div class="card-body">
                    <h2 class="card-title">
                        {anime.node.title}
                    </h2>
                    <div class="badge badge-secondary">
                        Eps. {anime.node.num_episodes}
                    </div>
                    <!-- <p>{anime.node.synopsis}</p> -->
                    <div>
                        {#each anime.node.genres as genre}
                            <kbd class="kbd kbd-sm">{genre.name}</kbd>
                        {/each}
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>