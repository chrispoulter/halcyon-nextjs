import type { AppProps } from 'next/app';
import { Open_Sans } from 'next/font/google';
import router from 'next/router';
import { SessionProvider, signOut } from 'next-auth/react';
import {
    HydrationBoundary,
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
import { Footer } from '@/components/Footer/Footer';
import { Toaster } from '@/components/Toast/Toast';

import '@/styles/globals.css';

const font = Open_Sans({
    subsets: ['latin'],
    display: 'swap'
});

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: async (error: any) => {
            switch (error.status) {
                case 401:
                    await signOut({ callbackUrl: '/' });
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
                    await signOut({ callbackUrl: '/' });
                    break;

                case 403:
                    toast.error(
                        'Sorry, you do not have access to this resource.'
                    );
                    break;

                case 404:
                    toast.error(
                        'Sorry, the resource you were looking for could not be found.'
                    );
                    break;

                default:
                    toast.error(
                        message ||
                            'Sorry, something went wrong. Please try again later.'
                    );
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
        <Meta />

        <style jsx global>{`
            :root {
                --base-font: ${font.style.fontFamily};
            }
        `}</style>

        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                <HydrationBoundary state={dehydratedState}>
                    <Header />
                    <main>
                        <ErrorBoundary>
                            <Component {...pageProps} />
                        </ErrorBoundary>
                    </main>
                    <Footer />
                </HydrationBoundary>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </SessionProvider>
        <Toaster />
    </>
);

export default App;
