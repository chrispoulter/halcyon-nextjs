import { ApolloError } from 'apollo-server';
import { getUserByEmailAddress } from '../data/userRepository';
import { generateToken } from '../utils/jwt';
import { verifyHash } from '../utils/hash';

export const tokenResolvers = {
    Mutation: {
        generateToken: async (_, { input }) => {
            const user = await getUserByEmailAddress(input.emailAddress);
            if (!user) {
                throw new ApolloError('The credentials provided were invalid.');
            }

            const verified = await verifyHash(input.password, user.password);
            if (!verified) {
                throw new ApolloError('The credentials provided were invalid.');
            }

            if (user.isLockedOut) {
                throw new ApolloError(
                    'This account has been locked out, please try again later.'
                );
            }

            return generateToken(user);
        }
    }
};
