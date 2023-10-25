import { SeedUser } from '@/features/seed/seedTypes';
import { hashPassword } from '@/utils/hash';
import { mapHandlers, Handler } from '@/utils/handler';
import prisma from '@/utils/prisma';
import { config } from '@/utils/config';

const seedUsers: SeedUser[] = [
    {
        emailAddress: config.SEED_EMAIL_ADDRESS,
        password: config.SEED_PASSWORD,
        firstName: 'System',
        lastName: 'Administrator',
        dateOfBirth: '1970-01-01T00:00:00.000Z',
        roles: ['SYSTEM_ADMINISTRATOR']
    }
];

const seedHandler: Handler = async (_, res) => {
    for (const seedUser of seedUsers) {
        const user = {
            ...seedUser,
            password: await hashPassword(seedUser.password),
            search: `${seedUser.emailAddress} ${seedUser.firstName} ${seedUser.lastName}`,
            version: crypto.randomUUID()
        };

        await prisma.users.upsert({
            where: { emailAddress: user.emailAddress },
            update: user,
            create: user
        });
    }

    return res.send('Environment seeded.');
};

export default mapHandlers({
    get: seedHandler
});
