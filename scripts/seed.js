import {
    userRepository,
    templateRepository,
    roleRepository
} from '../api/data';
import { createDatabase, query } from '../api/utils/database';
import { generateHash } from '../api/utils/hash';
import { ALL_ROLES } from '../api/utils/auth';
import { config } from '../api/utils/config';

import resetPassword from './templates/resetPassword.html';

const subjectRegEx = new RegExp(/<title>\s*(.+?)\s*<\/title>/);

(async () => {
    await createDatabase();

    await query(`CREATE TABLE IF NOT EXISTS templates (
        template_id SERIAL PRIMARY KEY,
        key VARCHAR UNIQUE NOT NULL,
        subject VARCHAR NOT NULL,
        html VARCHAR NOT NULL
    )`);

    await query(`CREATE TABLE IF NOT EXISTS roles (
        role_id SERIAL PRIMARY KEY,
        name VARCHAR UNIQUE NOT NULL
     )`);

    await query(`CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        email_address VARCHAR UNIQUE NOT NULL,
        password VARCHAR NULL,
        password_reset_token VARCHAR NULL,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        date_of_birth TIMESTAMP WITH TIME ZONE NOT NULL,
        is_locked_out BOOL NOT NULL DEFAULT FALSE
    )`);

    await query(`CREATE TABLE IF NOT EXISTS user_roles (
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (role_id) REFERENCES roles (role_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
      )`);

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
