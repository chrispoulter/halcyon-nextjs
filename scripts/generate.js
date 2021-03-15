import { Client, query as q } from 'faunadb';
import { config } from '../api/utils/config';

(async () => {
    const database = config.ENVIRONMENT;

    const collections = [
        {
            name: 'users',
            indexes: [
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
                }
            ]
        },
        {
            name: 'templates',
            indexes: [
                {
                    name: 'templates_by_key',
                    source: q.Collection('templates'),
                    terms: [{ field: ['data', 'key'] }],
                    unique: true
                }
            ]
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

    for (const { name, indexes } of collections) {
        try {
            await client.query(q.CreateCollection({ name }));
            console.log(`Collection ${name} created.`);
        } catch (error) {
            console.log(`Collection ${name}: ${error.message}`);
        }

        for (const index of indexes) {
            try {
                await client.query(q.CreateIndex(index));
                console.log(`Index ${index.name} created.`);
            } catch (error) {
                console.log(`Collection ${index.name}: ${error.message}`);
            }
        }
    }

    process.exit(0);
})();
