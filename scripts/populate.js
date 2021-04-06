import faker from 'faker';
import { dataSources } from '../api/dataSources';

const { users } = dataSources();

(async () => {
    for (var i = 1; i <= 50; i++) {
        const emailAddress = faker.internet.exampleEmail();
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const dateOfBirth = faker.date.past().toISOString();
        const isLockedOut = faker.datatype.boolean();

        await users.upsert({
            emailAddress,
            firstName,
            lastName,
            dateOfBirth,
            isLockedOut
        });
    }

    process.exit(0);
})();
