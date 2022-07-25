import { userRepository } from '../src/pages/api/data';

const firstNames = [
    'Amelia',
    'Olivia',
    'Emily',
    'Isla',
    'Charlie',
    'George',
    'Harry',
    'Jack',
    'Oliver'
];

const lastNames = [
    'Smith',
    'Jones',
    'Taylor',
    'Williams',
    'Brown',
    'Davies',
    'Evans',
    'Wilson',
    'Thomas',
    'Roberts'
];

(async () => {
    for (var i = 1; i <= 50; i++) {
        const firstNameIndex = Math.floor(Math.random() * firstNames.length);
        const lastNameIndex = Math.floor(Math.random() * lastNames.length);
        const emailAddressIndex = Math.floor(Math.random() * 100000) + 1;

        const first_name = firstNames[firstNameIndex];
        const last_name = lastNames[lastNameIndex];
        const email_address = `${first_name.toLowerCase()}.${last_name.toLowerCase()}.${emailAddressIndex}@chrispoulter.com`;
        const date_of_birth = '1970-01-01T00:00:00.000Z';

        await userRepository.upsert({
            email_address,
            first_name,
            last_name,
            date_of_birth
        });
    }

    process.exit(0);
})();
