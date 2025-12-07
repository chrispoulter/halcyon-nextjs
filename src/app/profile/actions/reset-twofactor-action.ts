'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { actionClient, ActionError } from '@/lib/safe-action';
import { getSession } from '@/lib/session';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { generateTOTPSecret, generateQRCodeDataUrl } from '@/lib/twofactor';

const schema = z.object({});

export const resetTwoFactorAction = actionClient
    .metadata({ actionName: 'resetTwoFactorAction' })
    .inputSchema(schema)
    .action(async () => {
        const session = await getSession();

        if (!session) {
            throw new ActionError('You must be signed in to reconfigure 2FA');
        }

        const { base32, otpauth } = generateTOTPSecret(session.email);
        const qr = await generateQRCodeDataUrl(otpauth);

        await db
            .update(users)
            .set({ twoFactorSecret: base32, twoFactorEnabled: false })
            .where(eq(users.id, session.sub));

        return { qr, secret: base32 };
    });
