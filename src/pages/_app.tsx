import type { AppProps } from 'next/app';
import { Open_Sans } from 'next/font/google';
import router from 'next/router';
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

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: Infinity,
            cacheTime: Infinity
        },
        mutations: {
            retry: false,
            cacheTime: Infinity
        }
    },
    queryCache: new QueryCache({
        onError: async (error: any) => {
            switch (error.status) {
                case 401:
                    await signOut({ callbackUrl: router.asPath });
                    break;

                case 403:
                    router.push('/403', router.asPath);
                    break;

                case 404:
                    router.push('/404', router.asPath);
                    break;

                default:
                    router.push('/500', router.asPath);
                    break;
            }
        }
    }),
    mutationCache: new MutationCache({
        onSuccess: (data: any) => {
            if (data.message) {
                toast.success(data.message);
            }
        },
        onError: async (error: any) => {
            const message = error.response?.message || error.message;

            switch (error.status) {
                case 401:
                    await signOut({ callbackUrl: router.asPath });
                    break;

                default:
                    toast.error(message);
                    break;
            }
        }
    })
});

const App = ({
    Component,
    pageProps: { session, dehydratedState = {}, ...pageProps }
}: AppProps) => (
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

export default App;
