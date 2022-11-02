import { generateHash } from '@/utils/hash';
import { getHandler } from '@/utils/handler';
import { ALL_ROLES } from '@/utils/auth';
import prisma from '@/utils/prisma';
import { config } from '@/utils/config';

const handler = getHandler();

handler.get(async (_, res) => {
    await prisma.roles.createMany({
        data: ALL_ROLES.map(name => ({ name })),
        skipDuplicates: true
    });

    const seedUser = {
        email_address: config.SEED_EMAIL_ADDRESS,
        password: await generateHash(config.SEED_PASSWORD),
        password_reset_token: null,
        first_name: 'System',
        last_name: 'Administrator',
        date_of_birth: new Date(1970, 0, 1).toISOString(),
        is_locked_out: false
    };

    const user = await prisma.users.upsert({
        where: { email_address: seedUser.email_address },
        update: seedUser,
        create: seedUser
    });

    const roles = await prisma.roles.findMany({
        where: {
            name: { in: ALL_ROLES }
        }
    });

    await prisma.user_roles.deleteMany({
        where: {
            user_id: user.user_id
        }
    });

    await prisma.user_roles.createMany({
        data: roles.map(role => ({
            role_id: role.role_id,
            user_id: user.user_id
        }))
    });

    return res.json({
        code: 'ENVIRONMENT_SEEDED',
        message: 'Environment seeded.'
    });
});

export default handler;
