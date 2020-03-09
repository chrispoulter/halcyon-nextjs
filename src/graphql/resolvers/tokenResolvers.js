const { UserInputError } = require('apollo-server');
const { getUserByEmailAddress } = require('../../data/userRepository');
const { generateToken } = require('../../utils/jwt');
const { verifyPassword } = require('../../utils/password');

module.exports = {
    Mutation: {
        generateToken: async (_, { input }) => {
            const user = await getUserByEmailAddress(input.emailAddress);
            if (!user) {
                throw new UserInputError(
                    'The credentials provided were invalid.'
                );
            }

            const verified = await verifyPassword(
                input.password,
                user.password
            );

            if (!verified) {
                throw new UserInputError(
                    'The credentials provided were invalid.'
                );
            }

            if (user.isLockedOut) {
                throw new UserInputError(
                    'This account has been locked out, please try again later.'
                );
            }

            return generateToken(user);
        }
    }
};
