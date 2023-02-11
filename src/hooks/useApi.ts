import { useState, useEffect } from 'react';

export const apiStatus = {
    loading: 'loading',
    success: 'success',
    error: 'error',
};

export const apiConfig = {
    method: "GET",
    headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "cache-control": "no-cache",
        "X-MAL-CLIENT-ID": "", // TODO: Replace with env variable
    }
};

export const useApi = (url: string) => {
    const [apiState, setApiState] = useState({
        status: apiStatus.loading,
        error: '',
        data: undefined,
    });

    useEffect(() => {
        const setPartialData = (partialData: any) => setApiState({ ...apiState, ...partialData });

        setPartialData({ status: apiStatus.loading });
        fetch(url, apiConfig)
            .then((res) => res.json())
            .then((data: any) => setPartialData({ status: apiStatus.success, data }))
            .catch((err: any) => setPartialData({ status: apiStatus.error, error: JSON.stringify(err) }))
    }, [url])

    return apiState;
}
