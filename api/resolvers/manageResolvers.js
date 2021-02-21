import { ApolloError } from 'apollo-server';
import { isAuthenticated } from '../context';
import { generateHash, verifyHash } from '../utils/hash';

export const manageResolvers = {
    Query: {
        getProfile: isAuthenticated(async (_, __, { dataSources, payload }) =>
            dataSources.users.getUserById(payload.sub)
        )
    },
    Mutation: {
        updateProfile: isAuthenticated(
            async (_, { input }, { dataSources, payload }) => {
                const user = await dataSources.users.getUserById(payload.sub);
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
                await dataSources.users.updateUser(user);

                return {
                    code: 'PROFILE_UPDATED',
                    message: 'Your profile has been updated.',
                    user
                };
            }
        ),
        changePassword: isAuthenticated(
            async (_, { input }, { dataSources, payload }) => {
                const user = await dataSources.users.getUserById(payload.sub);
                if (!user) {
                    throw new ApolloError('User not found.', 'USER_NOT_FOUND');
                }

                const verified = await verifyHash(
                    input.currentPassword,
                    user.password
                );

                if (!verified) {
                    throw new ApolloError(
                        'Incorrect password.',
                        'INCORRECT_PASSWORD'
                    );
                }

                user.password = await generateHash(input.newPassword);
                user.passwordResetToken = undefined;
                await dataSources.users.updateUser(user);

                return {
                    code: 'PASSWORD_CHANGED',
                    message: 'Your password has been changed.',
                    user
                };
            }
        ),
        deleteAccount: isAuthenticated(
            async (_, __, { dataSources, payload }) => {
                const user = await dataSources.users.getUserById(payload.sub);
                if (!user) {
                    throw new ApolloError('User not found.', 'USER_NOT_FOUND');
                }

                await dataSources.users.removeUser(user);

                return {
                    code: 'ACCOUNT_DELETED',
                    message: 'Your account has been deleted.',
                    user
                };
            }
        )
    }
};
