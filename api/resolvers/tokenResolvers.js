import { ApolloError } from 'apollo-server';
import { generateToken } from '../utils/jwt';
import { verifyHash } from '../utils/hash';

export const tokenResolvers = {
    Mutation: {
        generateToken: async (_, { input }, { dataSources: { users } }) => {
            const user = await users.getByEmailAddress(input.emailAddress);
            if (!user || !user.password) {
                throw new ApolloError(
                    'The credentials provided were invalid.',
                    'CREDENTIALS_INVALID'
                );
            }

            const verified = await verifyHash(input.password, user.password);
            if (!verified) {
                throw new ApolloError(
                    'The credentials provided were invalid.',
                    'CREDENTIALS_INVALID'
                );
            }

            if (user.isLockedOut) {
                throw new ApolloError(
                    'This account has been locked out, please try again later.',
                    'USER_LOCKED_OUT'
                );
            }

            return generateToken(user);
        }
    }
};
