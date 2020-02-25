const {
    searchUsers,
    getUserById,
    getUserByEmailAddress,
    createUser,
    updateUser,
    removeUser
} = require('../../data/userRepository');
const { isUserAdministrator } = require('../context');
const { hashPassword } = require('../../utils/password');

module.exports = {
    Query: {
        users: async (_, { page, size, search, sort }, context) => {
            isUserAdministrator(context);

            const result = await searchUsers(
                page || 1,
                size || 10,
                search,
                sort
            );

            return {
                items: result.items,
                pageInfo: {
                    page: result.page,
                    size: result.size,
                    totalPages: result.totalPages,
                    totalCount: result.totalCount,
                    hasNextPage: result.hasNextPage,
                    hasPreviousPage: result.hasPreviousPage
                },
                search,
                sort
            };
        },
        getUserById: async (_, { id }, context) => {
            isUserAdministrator(context);
            return getUserById(id);
        }
    },
    Mutation: {
        createUser: async (_, { input }, context) => {
            isUserAdministrator(context);

            const existing = await getUserByEmailAddress(input.emailAddress);
            if (existing) {
                return {
                    code: 400,
                    success: false,
                    message: `User name "${input.emailAddress}" is already taken.`
                };
            }

            const user = {
                emailAddress: input.emailAddress,
                password: await hashPassword(input.password),
                firstName: input.firstName,
                lastName: input.lastName,
                dateOfBirth: input.dateOfBirth,
                roles: input.roles
            };

            const result = await createUser(user);

            return {
                code: 200,
                success: true,
                message: 'User successfully created.',
                user: result
            };
        },
        updateUser: async (_, { id, input }, context) => {
            isUserAdministrator(context);

            const user = await getUserById(id);
            if (!user) {
                return {
                    code: 404,
                    success: false,
                    message: 'User not found.'
                };
            }

            if (user.emailAddress !== input.emailAddress) {
                const existing = await getUserByEmailAddress(
                    input.emailAddress
                );

                if (existing) {
                    return {
                        code: 400,
                        success: false,
                        message: `User name "${input.emailAddress}" is already taken.`
                    };
                }
            }

            user.emailAddress = input.emailAddress;
            user.firstName = input.firstName;
            user.lastName = input.lastName;
            user.dateOfBirth = input.dateOfBirth;
            user.roles = input.roles;
            await updateUser(user);

            return {
                code: 200,
                success: true,
                message: 'User successfully updated.',
                user
            };
        },
        lockUser: async (_, { id }, context) => {
            isUserAdministrator(context);

            const user = await getUserById(id);
            if (!user) {
                return {
                    code: 404,
                    success: false,
                    message: 'User not found.'
                };
            }

            if (user.id === context.payload.sub) {
                return {
                    code: 400,
                    success: false,
                    message: 'Cannot lock currently logged in user.'
                };
            }

            user.isLockedOut = true;
            await updateUser(user);

            return {
                code: 200,
                success: true,
                message: 'User successfully locked.',
                user
            };
        },
        unlockUser: async (_, { id }, context) => {
            isUserAdministrator(context);

            const user = await getUserById(id);
            if (!user) {
                return {
                    code: 404,
                    success: false,
                    message: 'User not found.'
                };
            }

            user.isLockedOut = false;
            await updateUser(user);

            return {
                code: 200,
                success: true,
                message: 'User successfully unlocked.',
                user
            };
        },
        deleteUser: async (_, { id }, context) => {
            isUserAdministrator(context);

            const user = await getUserById(id);
            if (!user) {
                return {
                    code: 404,
                    success: false,
                    message: 'User not found.'
                };
            }

            if (user.id === context.payload.sub) {
                return {
                    code: 400,
                    success: false,
                    message: 'Cannot delete currently logged in user.'
                };
            }

            await removeUser(user);

            return {
                code: 200,
                success: true,
                message: 'User successfully deleted.'
            };
        }
    }
};
