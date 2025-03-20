'use server';

import { z } from 'zod';
import { actionClient } from '@/lib/safe-action';
import { createSession } from '@/lib/session';
import { Role } from '@/lib/definitions';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
    password: z
        .string({ message: 'Password must be a valid string' })
        .min(1, 'Password is a required field'),
});

export const loginAction = actionClient
    .metadata({ actionName: 'loginAction' })
    .schema(schema)
    .action(async ({ parsedInput }) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log('request', parsedInput);

        await createSession({
            sub: 'fake-id',
            email: parsedInput.emailAddress,
            given_name: 'John',
            family_name: 'Doe',
            roles: [Role.SYSTEM_ADMINISTRATOR, Role.USER_ADMINISTRATOR],
        });
    });
