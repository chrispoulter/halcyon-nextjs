import React from 'react';
import { Route } from 'react-router';
import { useTranslation } from 'react-i18next';

export const PublicRoute = ({ component: PublicComponent, title, ...rest }) => {
    const { t } = useTranslation();

    const meta = t('components:publicRoute.meta', {
        returnObjects: true
    });

    document.title = title
        ? `${title} ${meta.seperator} ${meta.title}`
        : meta.title;

    return <Route component={PublicComponent} {...rest} />;
};
