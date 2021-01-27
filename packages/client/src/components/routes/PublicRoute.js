import React from 'react';
import { Route } from 'react-router';
import { useTranslation } from 'react-i18next';

export const PublicRoute = ({ component: PublicComponent, title, ...rest }) => {
    const { t } = useTranslation();

    const translatedSiteName = t("UI:SiteName");
    const translatedSeperator = t("UI:Seperator");

    document.title = title
        ? `${title} ${t(translatedSeperator)} ${t(translatedSiteName)}`
        : t(translatedSiteName);

    return <Route component={PublicComponent} {...rest} />;
};
