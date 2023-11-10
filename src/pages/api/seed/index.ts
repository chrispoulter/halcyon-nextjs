import { upsertUser } from '@/data/userRepository';
import { createApiRouter, onError } from '@/utils/router';
import { SYSTEM_ADMINISTRATOR } from '@/utils/auth';
import { config } from '@/utils/config';

const router = createApiRouter();

router.get(async (_, res) => {
    await upsertUser({
        emailAddress: config.SEED_EMAIL_ADDRESS,
        password: config.SEED_PASSWORD,
        firstName: 'System',
        lastName: 'Administrator',
        dateOfBirth: '1970-01-01',
        roles: [SYSTEM_ADMINISTRATOR]
    });

    return res.send('Environment seeded.');
});

export default router.handler({
    onError
});
