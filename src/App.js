import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
    AuthProvider,
    ApolloProvider,
    ModalProvider,
    ToastProvider,
    Header,
    Footer,
    Spinner,
    Meta,
    ErrorBoundary
} from './components';
import { Routes } from './Routes';

export const App = () => (
    <Suspense fallback={<Spinner />}>
        <BrowserRouter>
            <AuthProvider>
                <ModalProvider>
                    <ToastProvider>
                        <ApolloProvider>
                            <Meta />
                            <Header />
                            <ErrorBoundary>
                                <Routes />
                            </ErrorBoundary>
                            <Footer />
                        </ApolloProvider>
                    </ToastProvider>
                </ModalProvider>
            </AuthProvider>
        </BrowserRouter>
    </Suspense>
);
