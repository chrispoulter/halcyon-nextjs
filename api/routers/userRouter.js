import { Router } from 'express';

export const userRouter = Router();

userRouter.get('/', (_, res) => {
    return res.json({
        data: {
            items: [
                {
                    id: 1017,
                    emailAddress: 'amelia.thomas.25668@chrispoulter.com',
                    firstName: 'Amelia',
                    lastName: 'Thomas',
                    dateOfBirth: '1970-01-01T00:00:00Z',
                    isLockedOut: true,
                    roles: []
                },
                {
                    id: 1026,
                    emailAddress: 'charlie.taylor.79319@chrispoulter.com',
                    firstName: 'Charlie',
                    lastName: 'Taylor',
                    dateOfBirth: '1970-01-01T00:00:00Z',
                    isLockedOut: false,
                    roles: []
                },
                {
                    id: 1021,
                    emailAddress: 'charlie.thomas.19984@chrispoulter.com',
                    firstName: 'Charlie',
                    lastName: 'Thomas',
                    dateOfBirth: '1970-01-01T00:00:00Z',
                    isLockedOut: false,
                    roles: []
                },
                {
                    id: 1023,
                    emailAddress: 'chris.poulter@novafori.com',
                    firstName: 'Chris',
                    lastName: 'Poulter',
                    dateOfBirth: '2021-01-01T00:00:00Z',
                    isLockedOut: false,
                    roles: []
                },
                {
                    id: 1025,
                    emailAddress: 'chrisp-cix01@yopmail.com',
                    firstName: 'Chris',
                    lastName: 'Poulter',
                    dateOfBirth: '2021-01-02T00:00:00Z',
                    isLockedOut: false,
                    roles: []
                },
                {
                    id: 1027,
                    emailAddress: 'cpoulter@hotmail.co.uk',
                    firstName: 'Chris',
                    lastName: 'Poulter',
                    dateOfBirth: '1970-01-01T00:00:00Z',
                    isLockedOut: false,
                    roles: []
                },
                {
                    id: 1006,
                    emailAddress: 'emily.brown.98092@chrispoulter.com',
                    firstName: 'Emily',
                    lastName: 'Brown',
                    dateOfBirth: '1970-01-01T00:00:00Z',
                    isLockedOut: false,
                    roles: []
                },
                {
                    id: 1004,
                    emailAddress: 'george.brown.17210@chrispoulter.com',
                    firstName: 'George',
                    lastName: 'Brown',
                    dateOfBirth: '1970-01-01T00:00:00Z',
                    isLockedOut: false,
                    roles: []
                },
                {
                    id: 1010,
                    emailAddress: 'george.davies.87401@chrispoulter.com',
                    firstName: 'George',
                    lastName: 'Davies',
                    dateOfBirth: '1970-01-01T00:00:00Z',
                    isLockedOut: false,
                    roles: []
                },
                {
                    id: 1014,
                    emailAddress: 'harry.brown.50122@chrispoulter.com',
                    firstName: 'Harry',
                    lastName: 'Brown',
                    dateOfBirth: '1970-01-01T00:00:00Z',
                    isLockedOut: false,
                    roles: []
                }
            ],
            hasNextPage: true,
            hasPreviousPage: false
        }
    });
});

userRouter.post('/', (_, res) => {
    return res.json({
        data: {
            id: 1
        },
        code: 'USER_CREATED',
        message: 'User successfully created.'
    });
});

userRouter.get('/:userId', (_, res) => {
    return res.json({
        data: {
            id: 1027,
            emailAddress: 'cpoulter@hotmail.co.uk',
            firstName: 'Chris',
            lastName: 'Poulter',
            dateOfBirth: '1970-01-01T00:00:00Z',
            isLockedOut: false,
            roles: []
        }
    });
});

userRouter.put('/:userId', (_, res) => {
    return res.json({
        data: {
            id: 1027
        },
        code: 'USER_UPDATED',
        message: 'User successfully updated.'
    });
});

userRouter.put('/:userId/lock', (_, res) => {
    return res.json({
        data: {
            id: 1027
        },
        code: 'USER_LOCKED',
        message: 'User successfully locked.'
    });
});

userRouter.put('/:userId/unlock', (_, res) => {
    return res.json({
        data: {
            id: 1027
        },
        code: 'USER_UNLOCKED',
        message: 'User successfully unlocked.'
    });
});

userRouter.delete('/:userId', (_, res) => {
    return res.json({
        data: {
            id: 1027
        },
        code: 'USER_DELETED',
        message: 'User successfully deleted.'
    });
});
