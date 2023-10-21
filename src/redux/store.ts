import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { Context, createWrapper } from 'next-redux-wrapper';
import { api } from './api';
import { logger } from './logger';
import { GetServerSidePropsContext } from 'next';

const isGetServerSidePropsContext = (
    context: Context
): context is GetServerSidePropsContext => 'resolvedUrl' in context;

export const makeStore = (context: Context) => {
    let extraArgument: unknown = undefined;

    if (isGetServerSidePropsContext(context)) {
        extraArgument = { cookies: context.req.cookies };
    }

    const store = configureStore({
        reducer: {
            [api.reducerPath]: api.reducer
        },
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware({
                thunk: {
                    extraArgument
                }
            }).concat(api.middleware, logger)
    });

    setupListeners(store.dispatch);

    return store;
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper<AppStore>(makeStore, { debug: false });
