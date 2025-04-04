import 'dotenv/config';
import { Client } from 'pg';
import { config } from '@/lib/config';

async function main() {
    const client = new Client(config.DATABASE_URL);

    const postgresClient = new Client({
        host: client.host,
        port: client.port,
        ssl: client.ssl,
        user: client.user,
        password: client.password,
        database: 'postgres',
    });

    await postgresClient.connect();

    const res = await postgresClient.query(
        `SELECT 1 FROM pg_database WHERE datname='${client.database}'`
    );

    if (res.rowCount === 0) {
        await postgresClient.query(`CREATE DATABASE "${client.database}"`);
        console.log(`Database "${client.database}" created.`);
    } else {
        console.log(`Database "${client.database}" already exists.`);
    }

    await postgresClient.end();
}

main();
