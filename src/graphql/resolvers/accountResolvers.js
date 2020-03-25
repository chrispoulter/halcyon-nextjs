const { ApolloError } = require('apollo-server');
const uuidv4 = require('uuid/v4');
const {
    getUserByEmailAddress,
    createUser,
    updateUser
} = require('../../data/userRepository');
const { sendEmail } = require('../../utils/email');
const { hashPassword } = require('../../utils/password');

module.exports = {
    Mutation: {
        register: async (_, { input }, { pubsub }) => {
            const existing = await getUserByEmailAddress(input.emailAddress);
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
                dateOfBirth: input.dateOfBirth
            };

            const result = await createUser(user);

            pubsub.publish('userUpdated', {
                userUpdated: {
                    code: 'USER_CREATED',
                    user: result
                }
            });

            return {
                message: 'User successfully registered.',
                code: 'USER_REGISTERED',
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
                    'Instructions as to how to reset your password have been sent to you via email.',
                code: 'FORGOT_PASSWORD'
            };
        },
        resetPassword: async (_, { token, emailAddress, newPassword }) => {
            const user = await getUserByEmailAddress(emailAddress);
            if (!user || user.passwordResetToken !== token) {
                throw new ApolloError('Invalid token.', 'INVALID_TOKEN');
            }

            user.password = await hashPassword(newPassword);
            user.passwordResetToken = undefined;
            await updateUser(user);

            return {
                message: 'Your password has been reset.',
                code: 'PASSWORD_RESET',
                user
            };
        }
    }
};
