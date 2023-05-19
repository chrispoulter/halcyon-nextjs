import type { AppProps } from 'next/app';
import { Open_Sans } from 'next/font/google';
import { useRouter } from 'next/router';
import { SessionProvider, signOut } from 'next-auth/react';
import { SWRConfig } from 'swr';
import toast from 'react-hot-toast';
import { setLocale } from 'yup';
import { Meta } from '@/components/Meta/Meta';
import { Header } from '@/components/Header/Header';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import { Auth } from '@/components/Auth/Auth';
import { Footer } from '@/components/Footer/Footer';
import { Toaster } from '@/components/Toast/Toast';
import { formatForDisplay } from '@/utils/dates';
import { fetcher } from '@/utils/fetch';

import '@/styles/globals.css';

const font = Open_Sans({
    subsets: ['latin'],
    display: 'swap'
});

setLocale({
    date: {
        min: ({ label, min }) =>
            `${label} must be greater than or equal to ${formatForDisplay(
                min
            )}`,
        max: ({ label, max }) =>
            `${label} must be less than or equal to ${formatForDisplay(max)}`
    }
});

const App = ({
    Component,
    pageProps: { session, fallback = {}, ...pageProps }
}: AppProps) => {
    const router = useRouter();

    return (
        <>
            <Meta {...Component.meta} />

            <style jsx global>{`
                :root {
                    --base-font: ${font.style.fontFamily};
                }
            `}</style>

            <SessionProvider session={session}>
                <SWRConfig
                    value={{
                        fetcher,
                        fallback,
                        onSuccess: data => {
                            if (data.message) {
                                toast.success(data.message);
                            }
                        },
                        onError: error => {
                            switch (error.status) {
                                case 401:
                                    signOut({ callbackUrl: '/' });
                                    break;

                                case 403:
                                    router.push('/403', router.asPath);
                                    break;

                                default:
                                    toast.error(
                                        error.response?.message || error.message
                                    );
                            }
                        }
                    }}
                >
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
                </SWRConfig>
            </SessionProvider>
            <Toaster />
        </>
    );
};

export default App;
