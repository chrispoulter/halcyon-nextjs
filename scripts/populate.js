import faker from 'faker';
import { userRepository } from '../api/data';

(async () => {
    for (var i = 1; i <= 50; i++) {
        const first_name = faker.name.firstName();
        const last_name = faker.name.lastName();
        const date_of_birth = faker.date.past(18).toISOString();
        const is_locked_out = faker.datatype.boolean();

        const email_address = faker.internet.exampleEmail(
            first_name,
            last_name
        );

        await userRepository.upsert({
            email_address,
            first_name,
            last_name,
            date_of_birth,
            is_locked_out
        });
    }

    process.exit(0);
})();
