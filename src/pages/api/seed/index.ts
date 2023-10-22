import { hashPassword } from '@/utils/hash';
import { mapHandlers, Handler } from '@/utils/handler';
import prisma from '@/utils/prisma';
import { config } from '@/utils/config';

const seedHandler: Handler = async (_, res) => {
    const seedUser = {
        emailAddress: config.SEED_EMAIL_ADDRESS,
        password: await hashPassword(config.SEED_PASSWORD),
        passwordResetToken: null,
        firstName: 'System',
        lastName: 'Administrator',
        dateOfBirth: new Date(1970, 0, 1),
        isLockedOut: false,
        roles: ['SYSTEM_ADMINISTRATOR']
    };

    await prisma.users.upsert({
        where: { emailAddress: seedUser.emailAddress },
        update: seedUser,
        create: seedUser
    });

    return res.send('Environment seeded.');
};

export default mapHandlers({
    get: seedHandler
});
