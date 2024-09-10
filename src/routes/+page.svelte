<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
	import { fetchList } from "$lib/utils/requests";
	import AppTitle from "$lib/components/AppTitle.svelte";
	import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
	import ErrorIndicator from "$lib/components/ErrorIndicator.svelte";
	import AnimeList from "$lib/components/AnimeList.svelte";
	import AnimeStats from "$lib/components/AnimeStats.svelte";

    let animeList = writable([]);
    let isLoading = writable(false);
    let error = writable();

    onMount(() => {
        fetchList({
            onData: animeList.set,
            onError: error.set,
            onLoading: isLoading.set,
        });
    });
</script>

<div class="container mx-auto min-w-fit font-sans p-4">
    <svelte:component this={AppTitle} />
    {#if $isLoading}
        <svelte:component this={LoadingIndicator} />
    {/if}
    {#if $error}
        <svelte:component this={ErrorIndicator} {error} />
    {/if}
    {#if $animeList && !$isLoading && !$error}
        <!-- TODO: Add Search Bar Component -->
        <!-- TODO: Add Charts Component -->
        <svelte:component this={AnimeStats} {animeList} />
        <svelte:component this={AnimeList} {animeList} />
    {/if}
</div>