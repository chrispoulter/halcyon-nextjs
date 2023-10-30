import {
    BaseQueryApi,
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { IncomingMessage, ServerResponse } from 'http';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { config } from '@/utils/config';

const isExtraWithContext = (
    extra: unknown
): extra is {
    req: IncomingMessage & {
        cookies: Partial<{
            [key: string]: string;
        }>;
    };
    res: ServerResponse<IncomingMessage>;
} =>
    typeof extra === 'object' &&
    extra != null &&
    'req' in extra &&
    'res' in extra;

const prepareHeaders = async (
    headers: Headers,
    {
        extra
    }: Pick<BaseQueryApi, 'getState' | 'extra' | 'endpoint' | 'type' | 'forced'>
) => {
    const session = isExtraWithContext(extra)
        ? await getServerSession(extra.req, extra.res, authOptions)
        : await getSession();

    if (session) {
        headers.set('Authorization', `Bearer ${session.accessToken}`);
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
