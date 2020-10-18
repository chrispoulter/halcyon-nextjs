const { ApolloError } = require('apollo-server');
const { v4: uuidv4 } = require('uuid');
const {
    getUserByEmailAddress,
    createUser,
    updateUser
} = require('../data/userRepository');
const { sendEmail } = require('../utils/email');
const { generateHash } = require('../utils/hash');

module.exports = {
    Mutation: {
        register: async (_, { input }) => {
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
                roles: []
            });

            return {
                message: 'User successfully registered.',
                user: result
            };
        },
        forgotPassword: async (_, { emailAddress }) => {
            const user = await getUserByEmailAddress(emailAddress);
            if (user) {
                user.passwordResetToken = uuidv4();
                await updateUser(user);

                await sendEmail({
                    to: user.emailAddress,
                    template: 'resetPassword',
                    context: {
                        token: user.passwordResetToken
                    }
                });
            }

            return {
                message:
                    'Instructions as to how to reset your password have been sent to you via email.'
            };
        },
        resetPassword: async (_, { input }) => {
            const user = await getUserByEmailAddress(input.emailAddress);
            if (!user || user.passwordResetToken !== input.token) {
                throw new ApolloError('Invalid token.');
            }

            user.password = await generateHash(input.newPassword);
            user.passwordResetToken = undefined;
            await updateUser(user);

            return {
                message: 'Your password has been reset.',
                user
            };
        }
    }
};
