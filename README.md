# Anime

This project uses MyAnimeList.net account to fetch the user preferences of anime and display it in a nice chart or something like that.

## Usage

...

### MAL API Testing

...

```bash
curl 'https://api.myanimelist.net/v2/users/jraleman/animelist' -H 'X-MAL-CLIENT-ID: {clientID}'
```

Endpoints to be used:

- https://myanimelist.net/apiconfig/references/api/v2#operation/anime_get
- https://myanimelist.net/apiconfig/references/api/v2#operation/anime_anime_id_get
- https://myanimelist.net/apiconfig/references/api/v2#operation/anime_season_year_season_get
- https://myanimelist.net/apiconfig/references/api/v2#operation/users_user_id_animelist_get
- https://myanimelist.net/apiconfig/references/api/v2#operation/users_user_id_mangalist_get


# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## References

[MyAnimeList API (beta ver.) (2)](https://myanimelist.net/apiconfig/references/api/v2)
