import { generateHash } from '@/utils/hash';
import { getHandler } from '@/utils/handler';
import { ALL_ROLES } from '@/utils/auth';
import prisma from '@/utils/prisma';
import { config } from '@/utils/config';

const handler = getHandler();

handler.get(async (_, res) => {
    const seedUser = {
        emailAddress: config.SEED_EMAIL_ADDRESS,
        password: await generateHash(config.SEED_PASSWORD),
        passwordResetToken: null,
        firstName: 'System',
        lastName: 'Administrator',
        dateOfBirth: new Date(1970, 0, 1).toISOString(),
        isLockedOut: false,
        roles: ALL_ROLES
    };

    await prisma.users.upsert({
        where: { emailAddress: seedUser.emailAddress },
        update: seedUser,
        create: seedUser
    });

    return res.json({
        code: 'ENVIRONMENT_SEEDED',
        message: 'Environment seeded.'
    });
});

export default handler;
