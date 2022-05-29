import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts';
import AccessDenied from '../../pages/403';
import { isAuthorized } from '../../utils/auth';

export const RequireAuth = ({ children, requiredRoles }) => {
    const { currentUser } = useAuth();

    const router = useRouter();

    if (!isAuthorized(currentUser)) {
        return router.push('/login');
    }

    if (!isAuthorized(currentUser, requiredRoles)) {
        return <AccessDenied />;
    }

    return children;
};
