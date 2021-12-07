import { userRepository, templateRepository } from '../api/data';
import { generateHash } from '../api/utils/hash';
import { ALL_ROLES } from '../api/utils/auth';
import { config } from '../api/utils/config';

import resetPassword from './templates/resetPassword.html';

const subjectRegEx = new RegExp(/<title>\s*(.+?)\s*<\/title>/);

(async () => {
    await userRepository.upsert({
        email_address: config.SEED_EMAIL_ADDRESS,
        password: await generateHash(config.SEED_PASSWORD),
        first_name: 'System',
        last_name: 'Administrator',
        date_of_birth: new Date(1970, 0, 1).toISOString(),
        is_locked_out: false,
        roles: ALL_ROLES
    });

    await templateRepository.upsert({
        key: 'RESET_PASSWORD',
        subject: subjectRegEx.exec(resetPassword)[1],
        html: resetPassword
    });

    process.exit(0);
})();
