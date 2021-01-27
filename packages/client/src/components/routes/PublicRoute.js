import React from 'react';
import { Route } from 'react-router';
import { useTranslation } from 'react-i18next';

export const PublicRoute = ({ component: PublicComponent, title, ...rest }) => {
    const { t } = useTranslation();

    const baseTitle = t('Components:PublicRoute:BaseTitle');
    const seperator = t('Components:PublicRoute:Seperator');

    document.title = title
        ? `${title} ${seperator} ${baseTitle}`
        : t(baseTitle);

    return <Route component={PublicComponent} {...rest} />;
};
