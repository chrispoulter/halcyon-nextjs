import { dataSources } from '../api/dataSources';
import { generateHash } from '../api/utils/hash';
import { ALL_ROLES } from '../api/utils/auth';
import { config } from '../api/utils/config';

import resetPassword from './templates/resetPassword.html';

const { users, templates } = dataSources();

const subjectRegEx = new RegExp(/<title>\s*(.+?)\s*<\/title>/);

(async () => {
    await users.upsert({
        emailAddress: config.SEED_EMAILADDRESS,
        password: await generateHash(config.SEED_PASSWORD),
        firstName: 'System',
        lastName: 'Administrator',
        dateOfBirth: new Date(1970, 0, 1).toISOString(),
        roles: ALL_ROLES
    });

    await templates.upsert({
        key: 'RESET_PASSWORD',
        subject: subjectRegEx.exec(resetPassword)[1],
        html: resetPassword
    });

    process.exit(0);
})();
