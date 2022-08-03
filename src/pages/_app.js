import React, { Suspense } from 'react';
import {
    Header,
    Footer,
    Spinner,
    Meta,
    ErrorBoundary,
    Modal,
    Toast
} from '../components';
import { wrapper } from '../redux';

import '../styles/index.scss';

const App = ({ Component, pageProps }) => (
    <Suspense fallback={<Spinner />}>
        <Meta />
        <Header />
        <ErrorBoundary>
            <Component {...pageProps} />
        </ErrorBoundary>
        <Footer />
        <Modal />
        <Toast />
    </Suspense>
);

export default wrapper.withRedux(App);
