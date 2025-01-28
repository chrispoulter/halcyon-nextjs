import 'server-only';

import { createHash } from 'crypto';

export async function createGravatar(emailAddress: string): Promise<string> {
    const hashedEmail = createHash('sha256')
        .update(emailAddress.trim().toLowerCase())
        .digest('hex');

    return `https://www.gravatar.com/avatar/${hashedEmail}?d=404`;
}
