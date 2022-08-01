import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features';
import { useIsSSR } from '../../hooks';
import { isAuthorized } from '../../utils/auth';

export const HasPermission = ({ requiredRoles, fallback, children }) => {
    const currentUser = useSelector(selectCurrentUser);

    const isSSR = useIsSSR();

    if (isSSR) {
        return <>{fallback}</>;
    }

    const isAuthenticated = isAuthorized(currentUser, requiredRoles);
    if (!isAuthenticated) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};
