import { baseRouter, onError } from '@/utils/router';
import prisma from '@/utils/prisma';
import { hashPassword } from '@/utils/hash';
import { SYSTEM_ADMINISTRATOR } from '@/utils/auth';
import { config } from '@/utils/config';

const router = baseRouter.clone();

router.get(async (_, res) => {
    const user = {
        emailAddress: config.SEED_EMAIL_ADDRESS,
        password: await hashPassword(config.SEED_PASSWORD),
        firstName: 'System',
        lastName: 'Administrator',
        dateOfBirth: '1970-01-01T00:00:00.000Z',
        roles: [SYSTEM_ADMINISTRATOR],
        search: `${config.SEED_EMAIL_ADDRESS} System Administrator`,
        version: crypto.randomUUID()
    };

    await prisma.users.upsert({
        where: { emailAddress: user.emailAddress },
        update: user,
        create: user
    });

    return res.send('Environment seeded.');
});

export default router.handler({
    onError
});
