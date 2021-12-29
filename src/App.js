import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Header, Footer, Spinner, Meta, ErrorBoundary } from './components';
import { ModalProvider, ToastProvider } from './contexts';
import { Router } from './Router';
import { store } from './store';

export const App = () => (
    <Suspense fallback={<Spinner />}>
        <BrowserRouter>
            <Provider store={store}>
                <ModalProvider>
                    <ToastProvider>
                        <Meta />
                        <Header />
                        <ErrorBoundary>
                            <Router />
                        </ErrorBoundary>
                        <Footer />
                    </ToastProvider>
                </ModalProvider>
            </Provider>
        </BrowserRouter>
    </Suspense>
);
