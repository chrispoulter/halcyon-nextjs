import { Client, query as q } from 'faunadb';
import { UserRepository } from '../api/dataSources';
import { generateHash } from '../api/utils/hash';
import { allRoles } from '../api/utils/auth';
import { config } from '../api/utils/config';

(async () => {
    const adminClient = new Client({ secret: config.FAUNADB_SECRET });

    try {
        await adminClient.query(q.CreateDatabase({ name: config.ENVIRONMENT }));
        console.log('Database created.');
    } catch (error) {
        console.log(error.message);
    }

    const client = new Client({
        secret: `${config.FAUNADB_SECRET}:${config.ENVIRONMENT}:server`
    });

    try {
        await client.query(q.CreateCollection({ name: 'users' }));
        console.log('Collection created.');
    } catch (error) {
        console.log(error.message);
    }

    try {
        await client.query(
            q.CreateIndex({
                name: 'users_by_email_address',
                source: q.Collection('users'),
                terms: [{ field: ['data', 'emailAddress'] }],
                unique: true
            })
        );

        console.log('Index users_by_email_address created.');
    } catch (error) {
        console.log(error.message);
    }

    try {
        await client.query(
            q.CreateIndex({
                name: 'users_email_address_asc',
                source: q.Collection('users'),
                values: [
                    { field: ['data', 'emailAddress'] },
                    { field: ['data', 'firstName'] },
                    { field: ['data', 'lastName'] },
                    { field: ['ref'] }
                ]
            })
        );

        console.log('Index users_email_address_asc created.');
    } catch (error) {
        console.log(error.message);
    }

    try {
        await client.query(
            q.CreateIndex({
                name: 'users_email_address_desc',
                source: q.Collection('users'),
                values: [
                    { field: ['data', 'emailAddress'], reverse: true },
                    { field: ['data', 'firstName'], reverse: true },
                    { field: ['data', 'lastName'], reverse: true },
                    { field: ['ref'] }
                ]
            })
        );

        console.log('Index users_email_address_desc created.');
    } catch (error) {
        console.log(error.message);
    }

    try {
        await client.query(
            q.CreateIndex({
                name: 'users_name_asc',
                source: q.Collection('users'),
                values: [
                    { field: ['data', 'firstName'] },
                    { field: ['data', 'lastName'] },
                    { field: ['data', 'emailAddress'] },
                    { field: ['ref'] }
                ]
            })
        );

        console.log('Index users_name_asc created.');
    } catch (error) {
        console.log(error.message);
    }

    try {
        await client.query(
            q.CreateIndex({
                name: 'users_name_desc',
                source: q.Collection('users'),
                values: [
                    { field: ['data', 'firstName'], reverse: true },
                    { field: ['data', 'lastName'], reverse: true },
                    { field: ['data', 'emailAddress'], reverse: true },
                    { field: ['ref'] }
                ]
            })
        );

        console.log('Index users_name_desc created.');
    } catch (error) {
        console.log(error.message);
    }

    try {
        const users = new UserRepository();
        users.initialize();

        const existing = await users.getUserByEmailAddress(
            config.SEED_EMAILADDRESS
        );

        const user = {
            emailAddress: config.SEED_EMAILADDRESS,
            password: await generateHash(config.SEED_PASSWORD),
            firstName: 'System',
            lastName: 'Administrator',
            dateOfBirth: new Date(1970, 0, 1).toISOString(),
            isLockedOut: false,
            roles: allRoles
        };

        const method = existing
            ? users.updateUser({ ...existing, ...user })
            : users.createUser(user);

        await method;

        console.log('Admin user created.');
    } catch (error) {
        console.log(error.message);
    }
})();
