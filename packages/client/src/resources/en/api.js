export const api = {
    Codes: {
        USER_REGISTERED: 'User successfully registered.',
        FORGOT_PASSWORD:
            'Instructions as to how to reset your password have been sent to you via email.',
        PASSWORD_RESET: 'Your password has been reset.',
        PROFILE_UPDATED: 'Your profile has been updated.',
        PASSWORD_CHANGED: 'Your password has been changed.',
        ACCOUNT_DELETED: 'Your account has been deleted.',
        ENVIRONMENT_SEEDED: 'Environment seeded.',
        USER_CREATED: 'User successfully created.',
        USER_UPDATED: 'User successfully updated.',
        USER_LOCKED: 'User successfully locked.',
        USER_UNLOCKED: 'User successfully unlocked.',
        USER_DELETED: 'User successfully DELETED.',
        DUPLICATE_USER: 'User name "{{emailAddress}}" is already taken.',
        INVALID_TOKEN: 'Invalid token.',
        USER_NOT_FOUND: 'User not found.',
        INCORRECT_PASSWORD: 'Incorrect password.',
        CREDENTIALS_INVALID: 'The credentials provided were invalid.',
        USER_LOCKED_OUT:
            'This account has been locked out, please try again later.',
        LOCK_CURRENT_USER: 'Cannot lock currently logged in user.',
        DELETE_CURRENT_USER: 'Cannot delete currently logged in user.',
        UNKNOWN_ERROR:
            'An unknown error has occurred whilst communicating with the server.'
    },
    Roles: {
        SYSTEM_ADMINISTRATOR: 'System Administrator',
        USER_ADMINISTRATOR: 'User Administrator'
    }
};
