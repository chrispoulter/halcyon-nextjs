import { migrate } from 'postgres-migrations';
import { config } from '../api/utils/config';

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

    process.exit(0);
})();
