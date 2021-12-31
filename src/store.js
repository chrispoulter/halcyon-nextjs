import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { halcyonApi } from './services';
import { authReducer, modalReducer, toastReducer } from './features';

export const store = configureStore({
    reducer: {
        [halcyonApi.reducerPath]: halcyonApi.reducer,
        auth: authReducer,
        modal: modalReducer,
        toast: toastReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(halcyonApi.middleware)
});

setupListeners(store.dispatch);
