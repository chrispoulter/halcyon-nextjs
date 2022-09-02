import React, { Suspense } from 'react';
import {
    Header,
    Footer,
    Spinner,
    Meta,
    ErrorBoundary,
    Modal,
    Toast,
    Auth
} from '../components';
import { wrapper } from '../redux';

import '../styles/index.scss';

const App = ({ Component, pageProps }) => (
    <Suspense fallback={<Spinner />}>
        <Meta />
        <Header />
        <ErrorBoundary>
            {Component.auth ? (
                <Auth requiredRoles={Component.auth.requiredRoles}>
                    <Component {...pageProps} />
                </Auth>
            ) : (
                <Component {...pageProps} />
            )}
        </ErrorBoundary>
        <Footer />
        <Modal />
        <Toast />
    </Suspense>
);

export default wrapper.withRedux(App);
