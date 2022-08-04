import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux';
import AccessDenied from '../pages/403';
import { isAuthorized } from '../utils/auth';

export const RequireAuth = ({ children, requiredRoles }) => {
    const currentUser = useSelector(selectCurrentUser);

    const router = useRouter();

    if (!isAuthorized(currentUser)) {
        return router.push('/login');
    }

    if (!isAuthorized(currentUser, requiredRoles)) {
        return <AccessDenied />;
    }

    return children;
};
