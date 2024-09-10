import type { RequestHandler } from "@sveltejs/kit";
import { fetchUserAnimeStats } from "$lib/api/myAnimeList";

export const GET: RequestHandler = async () => {
    try {
        const stats = await fetchUserAnimeStats();
        return new Response(JSON.stringify(stats), {
            status: 200
        });
    } catch (error: any) {
        return new Response(error.message, {
            status: 500
        });
    }
}