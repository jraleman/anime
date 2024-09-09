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

<h1>My Anime View List</h1>

{#if $isLoading}
    <p>Loading...</p>
{/if}

{#if $error}
    <p>{$error}</p>
{/if}

<ul>
    {#each $animeList as anime}
    <li>
        <p>{anime.node.title}</p>
        <p>{anime.node.synopsis}</p>
        <img src={anime.node.main_picture.medium} alt={anime.node.title} />
    </li>
    {/each}
</ul>
