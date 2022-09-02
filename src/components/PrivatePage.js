import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux';
import { useIsSSR } from '../hooks';
import AccessDenied from '../pages/403';
import { Spinner } from './Spinner';
import { isAuthorized } from '../utils/auth';

export const PrivatePage = (PageComponent, requiredRoles) => {
    const PrivatePageComponent = () => {
        const currentUser = useSelector(selectCurrentUser);

        const isSSR = useIsSSR();

        const router = useRouter();

        if (isSSR) {
            return <Spinner />;
        }

        if (!isAuthorized(currentUser)) {
            router.push('/login');
            return <Spinner />;
        }

        if (!isAuthorized(currentUser, requiredRoles)) {
            return <AccessDenied />;
        }

        return <PageComponent />;
    };

    return PrivatePageComponent;
};
