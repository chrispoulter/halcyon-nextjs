import 'dotenv/config';
import { Client } from 'pg';
import { config } from '@/lib/config';

async function main() {
    const mainClient = new Client(config.DATABASE_URL);

    const { host, port, ssl, user, password, database } = mainClient;

    const postgresClient = new Client({
        host,
        port,
        ssl,
        user,
        password,
        database: 'postgres',
    });

    try {
        await postgresClient.connect();

        const { rows } = await postgresClient.query(
            'SELECT 1 FROM pg_database WHERE datname = $1',
            [database]
        );

        if (rows.length) {
            console.log(`✅ Database "${database}" already exists.`);
            return;
        }

        await postgresClient.query('CREATE DATABASE $1:name', [database]);

        console.log(`🎉 Database "${database}" created.`);
    } catch (error) {
        console.error('❌ Failed to create database', error);
        process.exit(1);
    } finally {
        await postgresClient.end();
    }
}

main();
