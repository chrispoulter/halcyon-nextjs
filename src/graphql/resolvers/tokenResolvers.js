const { ApolloError } = require('apollo-server');
const { getUserByEmailAddress } = require('../../data/userRepository');
const { generateToken } = require('../../utils/jwt');
const { verifyPassword } = require('../../utils/password');

module.exports = {
    Mutation: {
        generateToken: async (_, { input }) => {
            const user = await getUserByEmailAddress(input.emailAddress);
            if (!user) {
                throw new ApolloError(
                    'The credentials provided were invalid.',
                    'INVALID_CREDENTIALS'
                );
            }

            const verified = await verifyPassword(
                input.password,
                user.password
            );

            if (!verified) {
                throw new ApolloError(
                    'The credentials provided were invalid.',
                    'INVALID_CREDENTIALS'
                );
            }

            if (user.isLockedOut) {
                throw new ApolloError(
                    'This account has been locked out, please try again later.',
                    'LOCKED_OUT'
                );
            }

            return generateToken(user);
        }
    }
};
