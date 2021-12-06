export const userRepository = {
    search: async model => {
        return Promise.resolve({
            data: [
                {
                    id: 1,
                    emailAddress: 'chrisp-halcyon@yopmail.com',
                    password: 'TBC...',
                    passwordResetToken: 'TBC...',
                    firstName: 'Chris',
                    lastName: 'Poulter',
                    dateOfBirth: '2021-04-08T19:06:36.860Z',
                    isLockedOut: false,
                    roles: ['SYSTEM_ADMINISTRATOR', 'USER_ADMINISTRATOR']
                }
            ],
            hasNextPage: true,
            hasPreviousPage: true
        });
    },

    getById: async id => {
        return Promise.resolve({
            id: 1,
            emailAddress: 'chrisp-halcyon@yopmail.com',
            password: 'TBC...',
            passwordResetToken: 'TBC...',
            firstName: 'Chris',
            lastName: 'Poulter',
            dateOfBirth: '2021-04-08T19:06:36.860Z',
            isLockedOut: false,
            roles: ['SYSTEM_ADMINISTRATOR', 'USER_ADMINISTRATOR']
        });
    },

    getByEmailAddress: async emailAddress => {
        return Promise.resolve({
            id: 1,
            emailAddress: 'chrisp-halcyon@yopmail.com',
            password: 'TBC...',
            passwordResetToken: 'TBC...',
            firstName: 'Chris',
            lastName: 'Poulter',
            dateOfBirth: '2021-04-08T19:06:36.860Z',
            isLockedOut: false,
            roles: ['SYSTEM_ADMINISTRATOR', 'USER_ADMINISTRATOR']
        });
    },

    create: async model => {
        return Promise.resolve({
            id: 1
        });
    },

    update: async model => {
        return Promise.resolve({
            id: 1
        });
    },

    upsert: async model => {
        return Promise.resolve({
            id: 1
        });
    },

    remove: async model => {
        return Promise.resolve({
            id: 1
        });
    }
};
