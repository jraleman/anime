import { PUBLIC_MAL_USERNAME } from '$env/static/public';

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
    const response = await fetch(`/api/anime/${username}`);
    if (!response.ok) {
      onError('Error fetching anime list');
    }
    const data = await response.json();
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
    const response = await fetch(`/api/anime/stats`);
    if (!response.ok) {
      onError('Error fetching stats');
    }
    const data = await response.json();
    onData(data);
  } catch (err: any) {
    onError(err.message);
  } finally {
    onLoading(false);
  }
};
