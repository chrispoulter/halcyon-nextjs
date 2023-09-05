import { JwtPayload } from 'jsonwebtoken';

export enum Role {
    SYSTEM_ADMINISTRATOR = 'SYSTEM_ADMINISTRATOR',
    USER_ADMINISTRATOR = 'USER_ADMINISTRATOR'
}

export const roles = {
    [Role.SYSTEM_ADMINISTRATOR]: {
        title: 'System Administrator',
        description: 'A system administrator has access to the entire system.'
    },
    [Role.USER_ADMINISTRATOR]: {
        title: 'User Administrator',
        description: 'A user administrator can create / update / delete users.'
    }
};

export const roleOptions = Object.entries(roles).map(([value, item]) => ({
    value,
    ...item
}));

export const isUserAdministrator = [
    Role.SYSTEM_ADMINISTRATOR,
    Role.USER_ADMINISTRATOR
];

export const isAuthorized = (payload?: JwtPayload, requiredRoles?: Role[]) => {
    if (!payload) {
        return false;
    }

    if (!requiredRoles) {
        return true;
    }

    if (!payload.roles) {
        return false;
    }

    const userRoles = payload.roles;

    if (!requiredRoles.some(value => userRoles.includes(value))) {
        return false;
    }

    return true;
};
