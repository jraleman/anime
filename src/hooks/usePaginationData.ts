import { useState, useEffect } from 'react';

interface PaginationData<T> {
  data: T[];
  next: string | null;
  previous: string | null;
}

interface FetchOptions {
  url: string;
}

function usePaginationData<T>(fetchFunction: (options: FetchOptions) => Promise<PaginationData<T>>, initialUrl: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(initialUrl);

  useEffect(() => {
    const newData: T[] = [];

    async function fetchData(url: string | null) {
      if (!url) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetchFunction({ url });
        newData.push(...response.data);
        setNextUrl(response.next);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData(nextUrl);

    while (nextUrl !== null) {
      await fetchData(nextUrl);
    }

    setData(newData);
  }, [fetchFunction, initialUrl, nextUrl]);

  return { data, loading, error };
}

export default usePaginationData;
