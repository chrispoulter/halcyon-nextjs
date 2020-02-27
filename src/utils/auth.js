module.exports.isUserAdministrator = [
    'System Administrator',
    'User Administrator'
];

module.exports.isAuthorized = (user, requiredRoles) => {
    if (!user) {
        return false;
    }
    if (!requiredRoles) {
        return true;
    }

    if (!user.role) {
        return false;
    }

    const userRoles = user.role || [];
    if (!requiredRoles.some(value => userRoles.includes(value))) {
        return false;
    }

    return true;
};
