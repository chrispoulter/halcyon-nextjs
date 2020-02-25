const { AuthenticationError } = require('apollo-server');
const { getUserByEmailAddress } = require('../../data/userRepository');
const { generateToken } = require('../../utils/jwt');
const { verifyPassword } = require('../../utils/password');

module.exports = {
    Mutation: {
        getToken: async (_, { input }) => {
            const user = await getUserByEmailAddress(input.emailAddress);
            if (!user) {
                throw new AuthenticationError(
                    'The credentials provided were invalid.'
                );
            }

            const verified = await verifyPassword(
                input.password,
                user.password
            );

            if (!verified) {
                throw new AuthenticationError(
                    'The credentials provided were invalid.'
                );
            }

            if (user.isLockedOut) {
                throw new AuthenticationError(
                    'This account has been locked out, please try again later.'
                );
            }

            const token = generateToken(user);

            return {
                code: 200,
                success: true,
                token
            };
        }
    }
};
