const { ApolloError } = require('apollo-server');
const {
    searchUsers,
    getUserById,
    getUserByEmailAddress,
    createUser,
    updateUser,
    removeUser
} = require('../../data/userRepository');
const { isAuthenticated } = require('../context');
const { generateHash } = require('../../utils/hash');
const { USER_ADMINISTRATOR } = require('../../utils/auth');

module.exports = {
    Query: {
        searchUsers: isAuthenticated(
            async (_, { input }) => searchUsers(input),
            USER_ADMINISTRATOR
        ),
        getUserById: isAuthenticated(
            async (_, { id }) => getUserById(id),
            USER_ADMINISTRATOR
        )
    },
    Mutation: {
        createUser: isAuthenticated(async (_, { input }) => {
            const existing = await getUserByEmailAddress(input.emailAddress);

            if (existing) {
                throw new ApolloError(
                    `User name "${input.emailAddress}" is already taken.`,
                    'DUPLICATE_USER'
                );
            }

            const result = await createUser({
                emailAddress: input.emailAddress,
                password: await generateHash(input.password),
                firstName: input.firstName,
                lastName: input.lastName,
                dateOfBirth: input.dateOfBirth.toISOString(),
                isLockedOut: false,
                roles: input.roles
            });

            return {
                message: 'User successfully created.',
                code: 'USER_CREATED',
                user: result
            };
        }, USER_ADMINISTRATOR),
        updateUser: isAuthenticated(async (_, { id, input }) => {
            const user = await getUserById(id);
            if (!user) {
                throw new ApolloError('User not found.', 'USER_NOT_FOUND');
            }

            if (user.emailAddress !== input.emailAddress) {
                const existing = await getUserByEmailAddress(
                    input.emailAddress
                );

                if (existing) {
                    throw new ApolloError(
                        `User name "${input.emailAddress}" is already taken.`,
                        'DUPLICATE_USER'
                    );
                }
            }

            user.emailAddress = input.emailAddress;
            user.firstName = input.firstName;
            user.lastName = input.lastName;
            user.dateOfBirth = input.dateOfBirth.toISOString();
            user.roles = input.roles;
            await updateUser(user);

            return {
                message: 'User successfully updated.',
                code: 'USER_UPDATED',
                user
            };
        }, USER_ADMINISTRATOR),
        lockUser: isAuthenticated(async (_, { id }, { payload }) => {
            const user = await getUserById(id);
            if (!user) {
                throw new ApolloError('User not found.', 'USER_NOT_FOUND');
            }

            if (user.id === payload.sub) {
                throw new ApolloError(
                    'Cannot lock currently logged in user.',
                    'LOCK_CURRENT_USER'
                );
            }

            user.isLockedOut = true;
            await updateUser(user);

            return {
                message: 'User successfully locked.',
                code: 'USER_LOCKED',
                user
            };
        }, USER_ADMINISTRATOR),
        unlockUser: isAuthenticated(async (_, { id }) => {
            const user = await getUserById(id);
            if (!user) {
                throw new ApolloError('User not found.', 'USER_NOT_FOUND');
            }

            user.isLockedOut = false;
            await updateUser(user);

            return {
                message: 'User successfully unlocked.',
                code: 'USER_UNLOCKED',
                user
            };
        }, USER_ADMINISTRATOR),
        deleteUser: isAuthenticated(async (_, { id }, { payload }) => {
            const user = await getUserById(id);
            if (!user) {
                throw new ApolloError('User not found.', 'USER_NOT_FOUND');
            }

            if (user.id === payload.sub) {
                throw new ApolloError(
                    'Cannot delete currently logged in user.',
                    'DELETE_CURRENT_USER'
                );
            }

            await removeUser(user);

            return {
                message: 'User successfully deleted.',
                code: 'USER_DELETED',
                user
            };
        }, USER_ADMINISTRATOR)
    }
};
