import { ApolloError } from 'apollo-server';
import { isAuthenticated } from '../context';
import { generateHash } from '../utils/hash';
import { USER_ADMINISTRATOR_ROLES } from '../utils/auth';

export const userResolvers = {
    Query: {
        searchUsers: isAuthenticated(
            async (_, { input }, { dataSources: { users } }) =>
                users.search(input),
            USER_ADMINISTRATOR_ROLES
        ),
        getUserById: isAuthenticated(
            async (_, { id }, { dataSources: { users } }) => users.getById(id),
            USER_ADMINISTRATOR_ROLES
        )
    },
    Mutation: {
        createUser: isAuthenticated(
            async (_, { input }, { dataSources: { users } }) => {
                const existing = await users.getByEmailAddress(
                    input.emailAddress
                );

                if (existing) {
                    throw new ApolloError(
                        `User name "${input.emailAddress}" is already taken.`,
                        'DUPLICATE_USER'
                    );
                }

                const result = await users.create({
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
            },
            USER_ADMINISTRATOR_ROLES
        ),
        updateUser: isAuthenticated(
            async (_, { id, input }, { dataSources: { users } }) => {
                const user = await users.getById(id);
                if (!user) {
                    throw new ApolloError('User not found.', 'USER_NOT_FOUND');
                }

                if (user.emailAddress !== input.emailAddress) {
                    const existing = await users.getByEmailAddress(
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
                await users.update(user);

                return {
                    code: 'USER_UPDATED',
                    message: 'User successfully updated.',
                    user
                };
            },
            USER_ADMINISTRATOR_ROLES
        ),
        lockUser: isAuthenticated(
            async (_, { id }, { dataSources: { users }, payload }) => {
                const user = await users.getById(id);
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
                await users.update(user);

                return {
                    code: 'USER_LOCKED',
                    message: 'User successfully locked.',
                    user
                };
            },
            USER_ADMINISTRATOR_ROLES
        ),
        unlockUser: isAuthenticated(
            async (_, { id }, { dataSources: { users } }) => {
                const user = await users.getById(id);
                if (!user) {
                    throw new ApolloError('User not found.', 'USER_NOT_FOUND');
                }

                user.isLockedOut = false;
                await users.update(user);

                return {
                    code: 'USER_UNLOCKED',
                    message: 'User successfully unlocked.',
                    user
                };
            },
            USER_ADMINISTRATOR_ROLES
        ),
        deleteUser: isAuthenticated(
            async (_, { id }, { dataSources: { users }, payload }) => {
                const user = await users.getById(id);
                if (!user) {
                    throw new ApolloError('User not found.', 'USER_NOT_FOUND');
                }

                if (user.id === payload.sub) {
                    throw new ApolloError(
                        'Cannot delete currently logged in user.',
                        'DELETE_CURRENT_USER'
                    );
                }

                await users.remove(user);

                return {
                    code: 'USER_DELETED',
                    message: 'User successfully deleted.',
                    user
                };
            },
            USER_ADMINISTRATOR_ROLES
        )
    }
};
