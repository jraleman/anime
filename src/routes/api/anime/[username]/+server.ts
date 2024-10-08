import type { RequestHandler } from '@sveltejs/kit';
import { fetchUserAnimeList } from '$lib/api/myAnimeList';

export const GET: RequestHandler = async ({ params }) => {
  const { username } = params;

  try {
    const animeList = await fetchUserAnimeList(username ?? '');
    return new Response(JSON.stringify(animeList), {
      status: 200
    });
  } catch (error: any) {
    return new Response(error.message || 'Error fetching anime list', {
      status: 500
    });
  }
};
