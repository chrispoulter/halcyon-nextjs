import Head from 'next/head';

type MetaProps = {
    app?: string;
    title?: string;
    separator?: string;
    description?: string;
    keywords?: string;
};

export const Meta = ({
    app = 'Halcyon',
    title,
    separator = ' // ',
    description = 'A Next.js web project template with a sense of peace and tranquillity.',
    keywords = 'react, docker, typescript, eslint, nextjs, prettier, tailwindcss, next-auth, zod, react-query, react-hook-form, playwright, headless-ui, react-hot-toast, vitest, tanstack-query, authjs, pages-router'
}: MetaProps) => (
    <Head>
        <title>{[title, app].filter(v => !!v).join(separator)}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />

        <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="format-detection" content="telephone=no" />

        <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#111827" />
        <meta name="apple-mobile-web-app-title" content="Halcyon" />
        <meta name="application-name" content="Halcyon" />
        <meta name="msapplication-TileColor" content="#111827" />
        <meta name="theme-color" content="#111827" />
    </Head>
);
