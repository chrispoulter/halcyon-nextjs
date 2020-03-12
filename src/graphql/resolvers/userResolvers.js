const { ApolloError, withFilter } = require('apollo-server');
const { combineResolvers } = require('graphql-resolvers');
const {
    searchUsers,
    getUserById,
    getUserByEmailAddress,
    createUser,
    updateUser,
    removeUser
} = require('../../data/userRepository');
const pubsub = require('../pubsub');
const { isAuthenticated } = require('../context');
const { hashPassword } = require('../../utils/password');
const { isAuthorized, USER_ADMINISTRATOR } = require('../../utils/auth');

module.exports = {
    Query: {
        searchUsers: combineResolvers(
            isAuthenticated(USER_ADMINISTRATOR),
            async (_, { page, size, search, sort }) => {
                const result = await searchUsers(
                    page || 1,
                    size || 10,
                    search,
                    sort
                );

                return {
                    ...result,
                    search,
                    sort
                };
            }
        ),
        getUserById: combineResolvers(
            isAuthenticated(USER_ADMINISTRATOR),
            async (_, { id }) => getUserById(id)
        )
    },
    Mutation: {
        createUser: combineResolvers(
            isAuthenticated(USER_ADMINISTRATOR),
            async (_, { input }) => {
                const existing = await getUserByEmailAddress(
                    input.emailAddress
                );
                if (existing) {
                    throw new ApolloError(
                        `User name "${input.emailAddress}" is already taken.`,
                        'DUPLICATE_USER'
                    );
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

                pubsub.publish('userCreated', { userCreated: result });

                return {
                    message: 'User successfully created.',
                    code: 'USER_CREATED',
                    user: result
                };
            }
        ),
        updateUser: combineResolvers(
            isAuthenticated(USER_ADMINISTRATOR),
            async (_, { id, input }) => {
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
                user.dateOfBirth = input.dateOfBirth;
                user.roles = input.roles;
                await updateUser(user);

                pubsub.publish('userUpdated', { userUpdated: user });

                return {
                    message: 'User successfully updated.',
                    code: 'USER_UPDATED',
                    user
                };
            }
        ),
        lockUser: combineResolvers(
            isAuthenticated(USER_ADMINISTRATOR),
            async (_, { id }, { payload }) => {
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

                pubsub.publish('userUpdated', { userUpdated: user });

                return {
                    message: 'User successfully locked.',
                    code: 'USER_LOCKED',
                    user
                };
            }
        ),
        unlockUser: combineResolvers(
            isAuthenticated(USER_ADMINISTRATOR),
            async (_, { id }) => {
                const user = await getUserById(id);
                if (!user) {
                    throw new ApolloError('User not found.', 'USER_NOT_FOUND');
                }

                user.isLockedOut = false;
                await updateUser(user);

                pubsub.publish('userUpdated', { userUpdated: user });

                return {
                    message: 'User successfully unlocked.',
                    code: 'USER_UNLOCKED',
                    user
                };
            }
        ),
        deleteUser: combineResolvers(
            isAuthenticated(USER_ADMINISTRATOR),
            async (_, { id }, { payload }) => {
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

                pubsub.publish('userRemoved', { userRemoved: user });

                return {
                    message: 'User successfully deleted.',
                    code: 'USER_DELETED',
                    user
                };
            }
        )
    },
    Subscription: {
        userCreated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('userCreated'),
                (_, __, { payload }) =>
                    isAuthorized(payload, USER_ADMINISTRATOR)
            )
        },
        userUpdated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('userUpdated'),
                (_, __, { payload }) =>
                    isAuthorized(payload, USER_ADMINISTRATOR)
            )
        },
        userRemoved: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('userRemoved'),
                (_, __, { payload }) =>
                    isAuthorized(payload, USER_ADMINISTRATOR)
            )
        }
    }
};
