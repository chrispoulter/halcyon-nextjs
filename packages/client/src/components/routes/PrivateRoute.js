import React, { useContext } from 'react';
import { Redirect } from 'react-router';
import { AuthContext } from '../providers/AuthProvider';
import { PublicRoute } from './PublicRoute';
import { AccessDeniedPage } from '../../pages';
import { isAuthorized } from '../../utils/auth';

export const PrivateRoute = ({
    component: PrivateComponent,
    requiredRoles,
    ...rest
}) => {
    const { currentUser } = useContext(AuthContext);

    if (!isAuthorized(currentUser)) {
        return <Redirect to="/login" />;
    }

    if (isAuthorized(currentUser, requiredRoles)) {
        return (
            <PublicRoute
                meta="pages:accessDenied.meta"
                component={AccessDeniedPage}
            />
        );
    }

    return <PublicRoute component={PrivateComponent} {...rest} />;
};
