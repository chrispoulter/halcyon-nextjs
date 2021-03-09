import { ApolloError } from 'apollo-server';
import { v4 as uuidv4 } from 'uuid';
import { publish } from '../utils/events';
import { generateHash } from '../utils/hash';
import { config } from '../utils/config';

export const accountResolvers = {
    Mutation: {
        register: async (_, { input }, { dataSources: { users } }) => {
            const existing = await users.getUserByEmailAddress(
                input.emailAddress
            );

            if (existing) {
                throw new ApolloError(
                    `User name "${input.emailAddress}" is already taken.`,
                    'DUPLICATE_USER'
                );
            }

            const result = await users.createUser({
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
        forgotPassword: async (
            _,
            { emailAddress },
            { dataSources: { users }, transactionId }
        ) => {
            const user = await users.getUserByEmailAddress(emailAddress);

            if (user) {
                user.passwordResetToken = uuidv4();
                await users.updateUser(user);

                await publish({
                    type: 'SEND_EMAIL',
                    data: {
                        to: user.emailAddress,
                        template: 'RESET_PASSWORD',
                        context: {
                            token: user.passwordResetToken,
                            clientUrl: config.CLIENT_URL
                        }
                    },
                    transactionId
                });
            }

            return {
                code: 'FORGOT_PASSWORD',
                message:
                    'Instructions as to how to reset your password have been sent to you via email.'
            };
        },
        resetPassword: async (_, { input }, { dataSources: { users } }) => {
            const user = await users.getUserByEmailAddress(input.emailAddress);
            if (!user || user.passwordResetToken !== input.token) {
                throw new ApolloError('Invalid token.', 'INVALID_TOKEN');
            }

            user.password = await generateHash(input.newPassword);
            user.passwordResetToken = undefined;
            await users.updateUser(user);

            return {
                code: 'PASSWORD_RESET',
                message: 'Your password has been reset.',
                user
            };
        }
    }
};
