import React from 'react';
import Head from 'next/head';

export const Meta = ({ title }) => {
    const baseTitle = 'Halcyon';
    const seperator = ' // ';
    const pageTitle = title ? `${title}${seperator}${baseTitle}` : baseTitle;

    return (
        <Head>
            <title>{pageTitle}</title>
            <meta
                name="description"
                content="A React web site project template."
            />
            <meta name="keywords" content="project template, react" />
            <meta name="format-detection" content="telephone=no" />
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/images/icons/apple-touch-icon.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/images/icons/favicon-32x32.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/images/icons/favicon-16x16.png"
            />
            <link
                rel="mask-icon"
                href="/images/icons/safari-pinned-tab.svg"
                color="#333"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <meta name="apple-mobile-web-app-title" content={baseTitle} />
            <meta name="application-name" content={baseTitle} />
            <meta name="msapplication-config" content="/browserconfig.xml" />
            <meta name="theme-color" content="#333" />
        </Head>
    );
};
