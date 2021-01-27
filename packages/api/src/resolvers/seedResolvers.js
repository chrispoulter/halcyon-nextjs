import {
    getUserByEmailAddress,
    createUser,
    updateUser
} from '../data/userRepository';
import { generateHash } from '../utils/hash';
import { AVAILABLE_ROLES } from '../utils/auth';
import { config } from '../utils/config';

export const seedResolvers = {
    Mutation: {
        seedData: async () => {
            const existing = await getUserByEmailAddress(
                config.SEED_EMAILADDRESS
            );

            const user = {
                emailAddress: config.SEED_EMAILADDRESS,
                password: await generateHash(config.SEED_PASSWORD),
                firstName: 'System',
                lastName: 'Administrator',
                dateOfBirth: new Date(1970, 0, 1).toISOString(),
                isLockedOut: false,
                roles: AVAILABLE_ROLES
            };

            const method = existing
                ? updateUser({ ...existing, ...user })
                : createUser(user);

            const result = await method;

            return {
                code: 'ENVIRONMENT_SEEDED',
                message: 'Environment seeded.',
                user: result
            };
        }
    }
};
