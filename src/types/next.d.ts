import type { NextComponentType, NextPageContext } from 'next';
import type { Router } from 'next/router';
import { MetaProps } from '@/components/Meta/Meta';
import { Role } from '@/utils/auth';

declare module 'next/app' {
    type AppProps<P = Record<string, unknown>> = {
        Component: NextComponentType<NextPageContext, any, P> & {
            meta?: MetaProps;
            auth?: boolean | Role[];
        };
        router: Router;
        __N_SSG?: boolean;
        __N_SSP?: boolean;
        pageProps: P & {
            session?: Session;
            fallback?: { [key: string]: any };
        };
    };
}
