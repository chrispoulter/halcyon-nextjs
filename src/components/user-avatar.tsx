import { createHash } from 'crypto';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SessionPayload } from '@/lib/session-types';

type UserAvatarProps = {
    session: SessionPayload;
};

export function UserAvatar({ session }: UserAvatarProps) {
    const hashedEmail = createHash('sha256')
        .update(session.email.trim().toLowerCase())
        .digest('hex');

    return (
        <Avatar>
            <AvatarImage
                src={`https://www.gravatar.com/avatar/${hashedEmail}?d=404`}
                alt={`${session.given_name} ${session.family_name}`}
            />
            <AvatarFallback>
                {session.given_name[0]} {session.family_name[0]}
            </AvatarFallback>
        </Avatar>
    );
}
