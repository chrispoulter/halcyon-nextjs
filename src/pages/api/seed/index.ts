import { query } from '@/data/db';
import { User } from '@/data/schema';
import { createApiRouter, onError } from '@/utils/router';
import { hashPassword } from '@/utils/hash';
import { SYSTEM_ADMINISTRATOR } from '@/utils/auth';
import { config } from '@/utils/config';

const router = createApiRouter();

router.get(async (_, res) => {
    await query<User>(
        `
INSERT INTO users (email_address, password, first_name, last_name, date_of_birth, is_locked_out, roles)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (email_address)
DO UPDATE SET 
	email_address = EXCLUDED.email_address, 
	password = EXCLUDED.password, 
	password_reset_token = EXCLUDED.password_reset_token, 
	first_name = EXCLUDED.first_name, 
	last_name = EXCLUDED.last_name, 
	date_of_birth = EXCLUDED.date_of_birth, 
	is_locked_out = EXCLUDED.is_locked_out, 
	roles = EXCLUDED.roles
RETURNING id;
`,
        [
            config.SEED_EMAIL_ADDRESS,
            await hashPassword(config.SEED_PASSWORD),
            'System',
            'Administrator',
            '1970-01-01T00:00:00.000Z',
            false,
            [SYSTEM_ADMINISTRATOR]
        ]
    );

    return res.send('Environment seeded.');
});

export default router.handler({
    onError
});
