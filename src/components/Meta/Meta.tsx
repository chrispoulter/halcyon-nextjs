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
    description = 'A web application template.',
    keywords = 'react, nextjs'
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
            href="/images/favicon/apple-touch-icon.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/images/favicon/favicon-32x32.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/images/favicon/favicon-16x16.png"
        />
        <link
            rel="mask-icon"
            href="/images/favicon/safari-pinned-tab.svg"
            color="#333"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-title" content={app} />
        <meta name="application-name" content={app} />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#333" />
    </Head>
);
