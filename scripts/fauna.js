import { Client, query as q } from 'faunadb';
import { generateHash } from '../api/utils/hash';
import { ALL_ROLES } from '../api/utils/auth';
import { config } from '../api/utils/config';

(async () => {
    const database = config.ENVIRONMENT;

    const collections = ['users', 'templates'];

    const indexes = [
        {
            name: 'users_by_email_address',
            source: q.Collection('users'),
            terms: [{ field: ['data', 'emailAddress'] }],
            unique: true
        },
        {
            name: 'users_email_address_asc',
            source: q.Collection('users'),
            values: [
                { field: ['data', 'emailAddress'] },
                { field: ['data', 'firstName'] },
                { field: ['data', 'lastName'] },
                { field: ['ref'] }
            ]
        },
        {
            name: 'users_email_address_desc',
            source: q.Collection('users'),
            values: [
                { field: ['data', 'emailAddress'], reverse: true },
                { field: ['data', 'firstName'], reverse: true },
                { field: ['data', 'lastName'], reverse: true },
                { field: ['ref'] }
            ]
        },
        {
            name: 'users_name_asc',
            source: q.Collection('users'),
            values: [
                { field: ['data', 'firstName'] },
                { field: ['data', 'lastName'] },
                { field: ['data', 'emailAddress'] },
                { field: ['ref'] }
            ]
        },
        {
            name: 'users_name_desc',
            source: q.Collection('users'),
            values: [
                { field: ['data', 'firstName'], reverse: true },
                { field: ['data', 'lastName'], reverse: true },
                { field: ['data', 'emailAddress'], reverse: true },
                { field: ['ref'] }
            ]
        },
        {
            name: 'templates_by_key',
            source: q.Collection('templates'),
            terms: [{ field: ['data', 'key'] }],
            unique: true
        }
    ];

    const items = [
        {
            collection: q.Collection('users'),
            data: {
                emailAddress: config.SEED_EMAILADDRESS,
                password: await generateHash(config.SEED_PASSWORD),
                firstName: 'System',
                lastName: 'Administrator',
                dateOfBirth: new Date(1970, 0, 1).toISOString(),
                isLockedOut: false,
                roles: ALL_ROLES
            }
        },
        {
            collection: q.Collection('templates'),
            data: {
                key: 'RESET_PASSWORD',
                subject: 'Password Reset // Halcyon',
                html:
                    '<html><head><title>Halcyon</title></head><body><p style="font-family: verdana, geneva, sans-serif; font-size: 11px;">We have received a request to reset your password.</p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px;">In order to complete the process and select a new password please click here:</p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px;"><a href="https://halcyon.chrispoulter.com/reset-password/{token}">Reset your password</a></p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px;"><strong>Important</strong>: If you did not request a password reset do not worry. Your account is still secure and your old password will remain active.</p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px;">Regards,<br /><strong>Halcyon</strong><br /><a href="https://halcyon.chrispoulter.com">https://halcyon.chrispoulter.com</a></p></body></html>'
            }
        }
    ];

    const adminClient = new Client({ secret: config.FAUNADB_SECRET });

    try {
        await adminClient.query(q.CreateDatabase({ name: database }));
        console.log(`Database ${database} created.`);
    } catch (error) {
        console.log(`Database ${database}: ${error.message}`);
    }

    const client = new Client({
        secret: `${config.FAUNADB_SECRET}:${database}:server`
    });

    for (const name of collections) {
        try {
            await client.query(q.CreateCollection({ name }));
            console.log(`Collection ${name} created.`);
        } catch (error) {
            console.log(`Collection ${name}: ${error.message}`);
        }
    }

    for (const index of indexes) {
        try {
            await client.query(q.CreateIndex(index));
            console.log(`Index ${index.name} created.`);
        } catch (error) {
            console.log(`Collection ${index.name}: ${error.message}`);
        }
    }

    for (const { collection, data } of items) {
        try {
            await client.query(q.Create(collection, { data }));
            console.log(`Data ${JSON.stringify(collection)} created.`);
        } catch (error) {
            console.log(`Data ${JSON.stringify(collection)}: ${error.message}`);
        }
    }
})();
