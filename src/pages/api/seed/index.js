import path from 'path';
import { migrate } from 'postgres-migrations';
import * as roleRepository from '../../../data/roleRepository';
import * as userRepository from '../../../data/userRepository';
import { generateHash } from '../../../utils/hash';
import { getHandler } from '../../../utils/handler';
import { ALL_ROLES } from '../../../utils/auth';
import { config } from '../../../utils/config';

const handler = getHandler();

handler.get(async (_, res) => {
    await migrate(
        {
            host: config.DB_HOST,
            port: config.DB_PORT,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_DATABASE,
            ssl: config.DB_SSL,
            ensureDatabaseExists: true,
            defaultDatabase: 'postgres'
        },
        path.join(process.cwd(), 'src', 'migrations')
    );

    await Promise.all(
        ALL_ROLES.map(name =>
            roleRepository.upsert({
                name
            })
        )
    );

    await userRepository.upsert({
        email_address: config.SEED_EMAIL_ADDRESS,
        password: await generateHash(config.SEED_PASSWORD),
        first_name: 'System',
        last_name: 'Administrator',
        date_of_birth: new Date(1970, 0, 1).toISOString(),
        roles: ALL_ROLES
    });

    return res.json({
        code: 'ENVIRONMENT_SEEDED',
        message: 'Environment seeded.'
    });
});

export default handler;
