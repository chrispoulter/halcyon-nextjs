import { ApolloError } from 'apollo-server';
import { isAuthenticated } from '../context';
import { generateHash } from '../utils/hash';
import { userAdministratorRoles } from '../utils/auth';

export const userResolvers = {
    Query: {
        searchUsers: isAuthenticated(
            async (_, { input }, { dataSources }) =>
                dataSources.users.searchUsers(input),
            userAdministratorRoles
        ),
        getUserById: isAuthenticated(
            async (_, { id }, { dataSources }) =>
                dataSources.users.getUserById(id),
            userAdministratorRoles
        )
    },
    Mutation: {
        createUser: isAuthenticated(async (_, { input }, { dataSources }) => {
            const existing = await dataSources.users.getUserByEmailAddress(
                input.emailAddress
            );

            if (existing) {
                throw new ApolloError(
                    `User name "${input.emailAddress}" is already taken.`,
                    'DUPLICATE_USER'
                );
            }

            const result = await dataSources.users.createUser({
                emailAddress: input.emailAddress,
                password: await generateHash(input.password),
                firstName: input.firstName,
                lastName: input.lastName,
                dateOfBirth: input.dateOfBirth.toISOString(),
                isLockedOut: false,
                roles: input.roles
            });

            return {
                code: 'USER_CREATED',
                message: 'User successfully created.',
                user: result
            };
        }, userAdministratorRoles),
        updateUser: isAuthenticated(
            async (_, { id, input }, { dataSources }) => {
                const user = await dataSources.users.getUserById(id);
                if (!user) {
                    throw new ApolloError('User not found.', 'USER_NOT_FOUND');
                }

                if (user.emailAddress !== input.emailAddress) {
                    const existing = await dataSources.users.getUserByEmailAddress(
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
                await dataSources.users.updateUser(user);

                return {
                    code: 'USER_UPDATED',
                    message: 'User successfully updated.',
                    user
                };
            },
            userAdministratorRoles
        ),
        lockUser: isAuthenticated(
            async (_, { id }, { dataSources, payload }) => {
                const user = await dataSources.users.getUserById(id);
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
                await dataSources.users.updateUser(user);

                return {
                    code: 'USER_LOCKED',
                    message: 'User successfully locked.',
                    user
                };
            },
            userAdministratorRoles
        ),
        unlockUser: isAuthenticated(async (_, { id }, { dataSources }) => {
            const user = await dataSources.users.getUserById(id);
            if (!user) {
                throw new ApolloError('User not found.', 'USER_NOT_FOUND');
            }

            user.isLockedOut = false;
            await dataSources.users.updateUser(user);

            return {
                code: 'USER_UNLOCKED',
                message: 'User successfully unlocked.',
                user
            };
        }, userAdministratorRoles),
        deleteUser: isAuthenticated(
            async (_, { id }, { dataSources, payload }) => {
                const user = await dataSources.users.getUserById(id);
                if (!user) {
                    throw new ApolloError('User not found.', 'USER_NOT_FOUND');
                }

                if (user.id === payload.sub) {
                    throw new ApolloError(
                        'Cannot delete currently logged in user.',
                        'DELETE_CURRENT_USER'
                    );
                }

                await dataSources.users.removeUser(user);

                return {
                    code: 'USER_DELETED',
                    message: 'User successfully deleted.',
                    user
                };
            },
            userAdministratorRoles
        )
    }
};
