import { ApolloError } from 'apollo-server';
import {
    searchUsers,
    getUserById,
    getUserByEmailAddress,
    createUser,
    updateUser,
    removeUser
} from '../data/userRepository';
import { isAuthenticated } from '../context';
import { generateHash } from '../utils/hash';
import { IS_USER_ADMINISTRATOR } from '../utils/auth';

export const userResolvers = {
    Query: {
        searchUsers: isAuthenticated(
            async (_, { input }) => searchUsers(input),
            IS_USER_ADMINISTRATOR
        ),
        getUserById: isAuthenticated(
            async (_, { id }) => getUserById(id),
            IS_USER_ADMINISTRATOR
        )
    },
    Mutation: {
        createUser: isAuthenticated(async (_, { input }) => {
            const existing = await getUserByEmailAddress(input.emailAddress);

            if (existing) {
                throw new ApolloError(
                    `User name "${input.emailAddress}" is already taken.`
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
                user: result
            };
        }, IS_USER_ADMINISTRATOR),
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
                        `User name "${input.emailAddress}" is already taken.`
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
                user
            };
        }, IS_USER_ADMINISTRATOR),
        lockUser: isAuthenticated(async (_, { id }, { payload }) => {
            const user = await getUserById(id);
            if (!user) {
                throw new ApolloError('User not found.');
            }

            if (user.id === payload.sub) {
                throw new ApolloError('Cannot lock currently logged in user.');
            }

            user.isLockedOut = true;
            await updateUser(user);

            return {
                message: 'User successfully locked.',
                user
            };
        }, IS_USER_ADMINISTRATOR),
        unlockUser: isAuthenticated(async (_, { id }) => {
            const user = await getUserById(id);
            if (!user) {
                throw new ApolloError('User not found.');
            }

            user.isLockedOut = false;
            await updateUser(user);

            return {
                message: 'User successfully unlocked.',
                user
            };
        }, IS_USER_ADMINISTRATOR),
        deleteUser: isAuthenticated(async (_, { id }, { payload }) => {
            const user = await getUserById(id);
            if (!user) {
                throw new ApolloError('User not found.');
            }

            if (user.id === payload.sub) {
                throw new ApolloError(
                    'Cannot delete currently logged in user.'
                );
            }

            await removeUser(user);

            return {
                message: 'User successfully deleted.',
                user
            };
        }, IS_USER_ADMINISTRATOR)
    }
};
