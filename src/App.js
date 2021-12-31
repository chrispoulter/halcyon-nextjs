import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import {
    Header,
    Footer,
    Spinner,
    Meta,
    ErrorBoundary,
    Modal,
    Toast
} from './components';
import { Router } from './Router';
import { store } from './store';

export const App = () => (
    <Suspense fallback={<Spinner />}>
        <Provider store={store}>
            <BrowserRouter>
                <Meta />
                <Header />
                <ErrorBoundary>
                    <Router />
                </ErrorBoundary>
                <Footer />
                <Modal />
                <Toast />
            </BrowserRouter>
        </Provider>
    </Suspense>
);
