import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { createWrapper } from 'next-redux-wrapper';
import { halcyonApi } from './halcyonApi';

const makeStore  = () => {
    const store = configureStore({
        reducer: {
            [halcyonApi.reducerPath]: halcyonApi.reducer
        },
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware().concat(halcyonApi.middleware)
    });

    setupListeners(store.dispatch);

    return store;
};

export type AppStore = ReturnType<typeof makeStore >;

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper<AppStore>(makeStore , { debug: false });
