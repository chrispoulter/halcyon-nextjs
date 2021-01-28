import React from 'react';
import { Route } from 'react-router';
import { useTranslation } from 'react-i18next';

export const PublicRoute = ({ component: PublicComponent, title, ...rest }) => {
    const { t } = useTranslation();

    const baseTitle = t('components:publicRoute.baseTitle');
    const seperator = t('components:publicRoute.seperator');

    document.title = title ? `${title} ${seperator} ${baseTitle}` : baseTitle;

    return <Route component={PublicComponent} {...rest} />;
};
