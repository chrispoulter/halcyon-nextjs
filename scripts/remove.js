import { Client, query as q } from 'faunadb';
import { config } from '../api/utils/config';

(async () => {
    const database = config.ENVIRONMENT;

    const adminClient = new Client({ secret: config.FAUNADB_SECRET });

    try {
        await adminClient.query(
            adminClient.query(q.Delete(q.Database(database)))
        );
        console.log(`Database ${database} removed.`);
    } catch (error) {
        console.log(`Database ${database}: ${error.message}`);
    }

    process.exit(0);
})();
