const { UserInputError } = require('apollo-server');
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
        register: async (_, { input }) => {
            const existing = await getUserByEmailAddress(input.emailAddress);
            if (existing) {
                throw new UserInputError(
                    `User name "${input.emailAddress}" is already taken.`
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

            return {
                code: 200,
                success: true,
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
                        code: user.passwordResetToken
                    }
                });
            }

            return {
                code: 200,
                success: true,
                message:
                    'Instructions as to how to reset your password have been sent to you via email.'
            };
        },
        resetPassword: async (_, { token, emailAddress, newPassword }) => {
            const user = await getUserByEmailAddress(emailAddress);
            if (!user || user.passwordResetToken !== token) {
                throw new UserInputError('Invalid token.');
            }

            user.password = await hashPassword(newPassword);
            user.passwordResetToken = undefined;
            await updateUser(user);

            return {
                code: 200,
                success: true,
                message: 'Your password has been reset.',
                user
            };
        }
    }
};
