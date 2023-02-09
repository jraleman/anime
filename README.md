# Anime

This project uses MyAnimeList.net account to fetch the user preferences of anime and display it in a nice chart or something like that.

## Usecase

This project can be used in multiple and endless situations, one of them can be:

> On your first date with a person, they ask you what are you into... and the topic of Anime comes out. Then, your date asks you if you watch anime, and you answer back; "I am glad you asked, let me show you..."

And you show your date this project. You win. 

## Usage

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

## References

[MyAnimeList API (beta ver.) (2)](https://myanimelist.net/apiconfig/references/api/v2)
