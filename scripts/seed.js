import { migrate } from 'postgres-migrations';
import {
    userRepository,
    templateRepository,
    roleRepository
} from '../api/data';
import { generateHash } from '../api/utils/hash';
import { ALL_ROLES } from '../api/utils/auth';
import { config } from '../api/utils/config';

import resetPassword from './templates/resetPassword.html';

const subjectRegEx = new RegExp(/<title>\s*(.+?)\s*<\/title>/);

(async () => {
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
        './scripts/migrations'
    );

    await templateRepository.upsert({
        key: 'RESET_PASSWORD',
        subject: subjectRegEx.exec(resetPassword)[1],
        html: resetPassword
    });

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

    process.exit(0);
})();
