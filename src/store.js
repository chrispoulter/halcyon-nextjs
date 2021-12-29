import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { halcyonApi } from './services';
import { authReducer } from './features';

export const store = configureStore({
    reducer: {
        [halcyonApi.reducerPath]: halcyonApi.reducer,
        auth: authReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(halcyonApi.middleware)
});

setupListeners(store.dispatch);
