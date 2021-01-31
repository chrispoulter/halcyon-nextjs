import React from 'react';
import { Route } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

export const PublicRoute = ({ component: PublicComponent, meta, ...rest }) => {
    const { t } = useTranslation();

    const { title, description, keywords } = t(meta, {
        returnObjects: true
    });

    return (
        <>
            <Helmet>
                {title && <title>{title}</title>}
                {description && (
                    <meta name="description" content={description} />
                )}
                {keywords && <meta name="keywords" content={keywords} />}
            </Helmet>
            <Route component={PublicComponent} {...rest} />;
        </>
    );
};
