import type { AppProps } from 'next/app';
import { Open_Sans } from 'next/font/google';
import { useRouter } from 'next/router';
import { SessionProvider, signOut } from 'next-auth/react';
import {
    Hydrate,
    MutationCache,
    QueryCache,
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import toast from 'react-hot-toast';
import { Meta } from '@/components/Meta/Meta';
import { Header } from '@/components/Header/Header';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import { Auth } from '@/components/Auth/Auth';
import { Footer } from '@/components/Footer/Footer';
import { Toaster } from '@/components/Toast/Toast';

import '@/styles/globals.css';

const font = Open_Sans({
    subsets: ['latin'],
    display: 'swap'
});

const App = ({
    Component,
    pageProps: { session, dehydratedState = {}, ...pageProps }
}: AppProps) => {
    const router = useRouter();

    const onSuccess = (data: any) => {
        if (data.message) {
            toast.success(data.message);
        }
    };

    const onError = (error: any) => {
        switch (error.status) {
            case 401:
                signOut({ callbackUrl: '/' });
                break;

            case 403:
                router.push('/403', router.asPath);
                break;

            default:
                toast.error(error.response?.message || error.message);
        }
    };

    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError
        }),
        mutationCache: new MutationCache({
            onSuccess,
            onError
        })
    });

    return (
        <>
            <Meta {...Component.meta} />

            <style jsx global>{`
                :root {
                    --base-font: ${font.style.fontFamily};
                }
            `}</style>

            <SessionProvider session={session}>
                <QueryClientProvider client={queryClient}>
                    <Hydrate state={dehydratedState}>
                        <Header />
                        <main>
                            <ErrorBoundary>
                                {Component.auth ? (
                                    <Auth auth={Component.auth}>
                                        <Component {...pageProps} />
                                    </Auth>
                                ) : (
                                    <Component {...pageProps} />
                                )}
                            </ErrorBoundary>
                        </main>
                        <Footer />
                    </Hydrate>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </SessionProvider>
            <Toaster />
        </>
    );
};

export default App;
