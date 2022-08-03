import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { setupListeners } from '@reduxjs/toolkit/query';
import { halcyonApi, rtkQueryErrorLogger } from './services';
import { authReducer, modalReducer, toastReducer } from './features';

const combinedReducer = combineReducers({
    [halcyonApi.reducerPath]: halcyonApi.reducer,
    auth: authReducer,
    modal: modalReducer,
    toast: toastReducer
});

const rootReducer = (state, action) => {
    if (action.type === 'auth/removeToken') {
        state = undefined;
    }

    return combinedReducer(state, action);
};

export const makeStore = () => {
    const store = configureStore({
        reducer: rootReducer,
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware({
                serializableCheck: false
            }).concat(halcyonApi.middleware, rtkQueryErrorLogger)
    });

    setupListeners(store.dispatch);

    return store;
};

export const wrapper = createWrapper(makeStore, { debug: true });
