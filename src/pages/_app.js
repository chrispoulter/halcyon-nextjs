import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
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

const App = ({ Component, ...rest }) => {
    const { store, props } = wrapper.useWrappedStore(rest);

    return (
        <Suspense fallback={<Spinner />}>
            <Provider store={store}>
                <Meta />
                <Header />
                <ErrorBoundary>
                    {Component.auth ? (
                        <Auth requiredRoles={Component.auth.requiredRoles}>
                            <Component {...props.pageProps} />
                        </Auth>
                    ) : (
                        <Component {...props.pageProps} />
                    )}
                </ErrorBoundary>
                <Footer />
                <Modal />
                <Toast />
            </Provider>
        </Suspense>
    );
};

export default App;
