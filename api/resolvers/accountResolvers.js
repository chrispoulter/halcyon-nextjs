import { ApolloError } from 'apollo-server';
import { v4 as uuidv4 } from 'uuid';

import { sendEmail } from '../utils/email';
import { generateHash } from '../utils/hash';

export const accountResolvers = {
    Mutation: {
        register: async (_, { input }, { dataSources }) => {
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
                roles: []
            });

            return {
                code: 'USER_REGISTERED',
                message: 'User successfully registered.',
                user: result
            };
        },
        forgotPassword: async (_, { emailAddress }, { dataSources }) => {
            const user = await dataSources.users.getUserByEmailAddress(
                emailAddress
            );
            if (user) {
                user.passwordResetToken = uuidv4();
                await dataSources.users.updateUser(user);

                await sendEmail({
                    to: user.emailAddress,
                    template: 'resetPassword',
                    context: {
                        token: user.passwordResetToken
                    }
                });
            }

            return {
                code: 'FORGOT_PASSWORD',
                message:
                    'Instructions as to how to reset your password have been sent to you via email.'
            };
        },
        resetPassword: async (_, { input }, { dataSources }) => {
            const user = await dataSources.users.getUserByEmailAddress(
                input.emailAddress
            );
            if (!user || user.passwordResetToken !== input.token) {
                throw new ApolloError('Invalid token.', 'INVALID_TOKEN');
            }

            user.password = await generateHash(input.newPassword);
            user.passwordResetToken = undefined;
            await dataSources.users.updateUser(user);

            return {
                code: 'PASSWORD_RESET',
                message: 'Your password has been reset.',
                user
            };
        }
    }
};
