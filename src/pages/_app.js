import React, { Suspense } from 'react';
import { Header, Footer, Spinner, Meta, ErrorBoundary } from '../components';
import { AuthProvider, ModalProvider, ToastProvider } from '../contexts';

import '../styles/index.scss';

const App = ({ Component, pageProps }) => (
    <Suspense fallback={<Spinner />}>
        <AuthProvider>
            <ModalProvider>
                <ToastProvider>
                    <Meta />
                    <Header />
                    <ErrorBoundary>
                        <Component {...pageProps} />
                    </ErrorBoundary>
                    <Footer />
                </ToastProvider>
            </ModalProvider>
        </AuthProvider>
    </Suspense>
);

export default App;
