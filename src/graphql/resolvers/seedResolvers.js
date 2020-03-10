const {
    getUserByEmailAddress,
    createUser,
    removeUser
} = require('../../data/userRepository');
const pubsub = require('../pubsub');
const { hashPassword } = require('../../utils/password');
const config = require('../../utils/config');

module.exports = {
    Mutation: {
        seedData: async () => {
            const user = {
                emailAddress: config.SEED_EMAILADDRESS,
                password: await hashPassword(config.SEED_PASSWORD),
                firstName: 'System',
                lastName: 'Administrator',
                dateOfBirth: '1970-01-01',
                roles: ['System Administrator']
            };

            const existing = await getUserByEmailAddress(user.emailAddress);
            if (existing) {
                await removeUser(existing);

                pubsub.publish('userRemoved', { userRemoved: existing });
            }

            const result = await createUser(user);

            pubsub.publish('userCreated', { userCreated: result });

            return {
                message: 'Database seeded.'
            };
        }
    }
};
