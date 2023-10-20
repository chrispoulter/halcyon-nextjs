import {
    BaseQueryApi,
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { config } from '@/utils/config';

const isExtraWithCookies = (
    extra: unknown
): extra is {
    cookies: Partial<{
        [key: string]: string;
    }>;
} => typeof extra === 'object' && extra != null && 'cookies' in extra;

const prepareHeaders = (
    headers: Headers,
    {
        extra
    }: Pick<BaseQueryApi, 'getState' | 'extra' | 'endpoint' | 'type' | 'forced'>
) => {
    if (isExtraWithCookies(extra)) {
        const cookie = Object.entries(extra.cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ');

        headers.set('Cookie', cookie);
    }

    return headers;
};

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: config.API_URL,
        prepareHeaders
    }),
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath];
        }
    },
    endpoints: () => ({})
});

export const {
    util: { getRunningQueriesThunk }
} = api;
