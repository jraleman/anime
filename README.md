# Anime

This project uses MyAnimeList.net account to fetch the user preferences of anime and display it in a nice chart or something like that.

## Usage

### Developing

Once you've installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

### MAL API Testing

```bash
curl 'https://api.myanimelist.net/v2/users/{username}/animelist' -H 'X-MAL-CLIENT-ID: {clientID}'
```

## References

[MyAnimeList API (beta ver.) (2)](https://myanimelist.net/apiconfig/references/api/v2)
