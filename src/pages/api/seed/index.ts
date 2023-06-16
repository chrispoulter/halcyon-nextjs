import { generateHash } from '@/utils/hash';
import { handler, Handler } from '@/utils/handler';
import { Role } from '@/utils/auth';
import prisma from '@/utils/prisma';
import { config } from '@/utils/config';

const seedHandler: Handler = async (_, res) => {
    const seedUser = {
        emailAddress: config.SEED_EMAIL_ADDRESS,
        password: await generateHash(config.SEED_PASSWORD),
        passwordResetToken: null,
        firstName: 'System',
        lastName: 'Administrator',
        dateOfBirth: new Date(Date.UTC(1970, 0, 1)),
        isLockedOut: false,
        roles: Object.values(Role),
        version: crypto.randomUUID()
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
};

export default handler({
    get: seedHandler
});
