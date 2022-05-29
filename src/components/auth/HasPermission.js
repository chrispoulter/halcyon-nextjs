import React from 'react';
import { useAuth } from '../../contexts';
import { useIsSSR } from '../../hooks';
import { isAuthorized } from '../../utils/auth';

export const HasPermission = ({ requiredRoles, fallback, children }) => {
    const { currentUser } = useAuth();

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
