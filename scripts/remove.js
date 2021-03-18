import { Client, query as q } from 'faunadb';
import { config } from '../api/utils/config';

const [environment] = process.argv.slice(2);

const database = environment || config.ENVIRONMENT;

(async () => {
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
