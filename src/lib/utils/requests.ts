import { PUBLIC_MAL_USERNAME } from '$env/static/public';
import { fetchUserAnimeList, fetchUserAnimeStats } from '$lib/api/myAnimeList';

export type RequestProps = {
  username?: string;
  onLoading: (loading: boolean) => void;
  onError: (error: string | null) => void;
  onData: (data: any) => void;
};

export const fetchList = async ({ username = PUBLIC_MAL_USERNAME, onLoading, onError, onData }: RequestProps) => {
  onLoading(true);
  onError(null);
  try {
    const data = await fetchUserAnimeList(username);
    onData(data);
  } catch (err: any) {
    onError(err.message);
  } finally {
    onLoading(false);
  }
};

export const fetchStats = async ({ onLoading, onError, onData }: RequestProps) => {
  onLoading(true);
  onError(null);
  try {
    const data = await fetchUserAnimeStats();
    onData(data);
  } catch (err: any) {
    onError(err.message);
  } finally {
    onLoading(false);
  }
};
