import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Action, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { RootState } from './store';
import { config } from '@/utils/config';

const isHydrateAction = (action: Action): action is PayloadAction<RootState> =>
    action.type === HYDRATE;

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: config.API_URL
    }),
    extractRehydrationInfo(action, { reducerPath }): any {
        if (isHydrateAction(action)) {
            return action.payload[reducerPath];
        }
    },
    endpoints: () => ({})
}).enhanceEndpoints({ addTagTypes: ['User'] });

export const {
    util: { getRunningQueriesThunk }
} = api;
