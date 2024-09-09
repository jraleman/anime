import type { RequestHandler } from '@sveltejs/kit';
import { fetchAnimeList } from '$lib/api/myAnimeList';

export const GET: RequestHandler = async ({ params }) => {
  const { username } = params;

  try {
    const animeList = await fetchAnimeList(username ?? '');
    return new Response(JSON.stringify(animeList), {
      status: 200
    });
  } catch (error) {
    return new Response('Error fetching anime list', {
      status: 500
    });
  }
};
