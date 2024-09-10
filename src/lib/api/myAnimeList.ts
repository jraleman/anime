import axios from 'axios';
import { PUBLIC_MAL_BASE_URL } from '$env/static/public';
import { PRIVATE_MAL_CLIENT_ID, PRIVATE_MAL_CLIENT_SECRET } from '$env/static/private';

const baseURL = PUBLIC_MAL_BASE_URL;
const clientID = PRIVATE_MAL_CLIENT_ID;
const clientSecret = PRIVATE_MAL_CLIENT_SECRET;

export const myAnimeListApiV2 = axios.create({
  baseURL,
  headers: {
    'X-MAL-CLIENT-ID': clientID,
    'X-MAL-CLIENT-SECRET': clientSecret
  }
});

export const fetchUserAnimeList = async (username: string) => {
  const fieldsToFetch = ['list_status', 'synopsis', 'genres', 'num_episodes'];
  let allData: any[] = [];
  let nextUrl: string | null = `/users/${username}/animelist?limit=100&fields=${fieldsToFetch.join(',')}`;

  while (nextUrl) {
    try {
      const response: any = await myAnimeListApiV2.get(nextUrl);
      const { data, paging } = response.data;

      allData = [...allData, ...data];

      // If there is a `next` field, continue fetching data from that URL
      nextUrl = paging?.next || null;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`Error: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Error in making request');
      }
    }
  }
  return allData;
};

export const fetchUserAnimeStats = async () => {
  try {
    const response = await myAnimeListApiV2.get(`/users/@me?fields=anime_statistics`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(`Error: ${error.response.status} - ${error.response.data.message}`);
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error('Error in making request');
    }
  }
};
