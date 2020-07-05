const {
    getUserByEmailAddress,
    createUser,
    removeUser
} = require('../../data/userRepository');
const { generateHash } = require('../../utils/hash');
const config = require('../../utils/config');

module.exports = {
    Mutation: {
        seedData: async () => {
            const existing = await getUserByEmailAddress(
                config.SEED_EMAILADDRESS
            );

            if (existing) {
                await removeUser(existing);
            }

            await createUser({
                emailAddress: config.SEED_EMAILADDRESS,
                password: await generateHash(config.SEED_PASSWORD),
                firstName: 'System',
                lastName: 'Administrator',
                dateOfBirth: new Date(1970, 0, 1).toISOString(),
                isLockedOut: false,
                roles: ['System Administrator']
            });

            return {
                message: 'Environment seeded.',
                code: 'ENVIRONMENT_SEEDED'
            };
        }
    }
};
