const { ApolloError } = require('apollo-server');
const {
    getUserById,
    getUserByEmailAddress,
    updateUser,
    removeUser
} = require('../data/userRepository');
const { isAuthenticated } = require('../context');
const { generateHash, verifyHash } = require('../utils/hash');

module.exports = {
    Query: {
        getProfile: isAuthenticated(async (_, __, { payload }) =>
            getUserById(payload.sub)
        )
    },
    Mutation: {
        updateProfile: isAuthenticated(async (_, { input }, { payload }) => {
            const user = await getUserById(payload.sub);
            if (!user) {
                throw new ApolloError('User not found.');
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
            await updateUser(user);

            return {
                message: 'Your profile has been updated.',
                user
            };
        }),
        changePassword: isAuthenticated(async (_, { input }, { payload }) => {
            const user = await getUserById(payload.sub);
            if (!user) {
                throw new ApolloError('User not found.');
            }

            const verified = await verifyHash(
                input.currentPassword,
                user.password
            );

            if (!verified) {
                throw new ApolloError('Incorrect password.');
            }

            user.password = await generateHash(input.newPassword);
            user.passwordResetToken = undefined;
            await updateUser(user);

            return {
                message: 'Your password has been changed.',
                user
            };
        }),
        deleteAccount: isAuthenticated(async (_, __, { payload }) => {
            const user = await getUserById(payload.sub);
            if (!user) {
                throw new ApolloError('User not found.');
            }

            await removeUser(user);

            return {
                message: 'Your account has been deleted.',
                user
            };
        })
    }
};
