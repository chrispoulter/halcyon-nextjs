require('dotenv/config');

const { Client, query: q } = require('faunadb');

(async () => {
    const client = new Client({ secret: process.env.FAUNADB_SECRET });

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
})();
