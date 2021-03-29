import { dataSources } from '../api/dataSources';

const { users } = dataSources();

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

        const firstName = firstNames[firstNameIndex];
        const lastName = lastNames[lastNameIndex];
        const emailAddress = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${emailAddressIndex}@chrispoulter.com`;
        const dateOfBirth = new Date(1970, 0, 1).toISOString();
        const isLockedOut = false;
        const roles = [];

        await users.upsert({
            emailAddress,
            firstName,
            lastName,
            dateOfBirth,
            isLockedOut,
            roles
        });
    }

    process.exit(0);
})();
