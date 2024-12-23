import { createHash } from 'crypto';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SessionPayload } from '@/lib/definitions';

type UserAvatarProps = {
    session: SessionPayload;
    children?: React.ReactNode;
};

export function UserAvatar({ session, children }: UserAvatarProps) {
    const hashedEmail = createHash('sha256')
        .update(session.emailAddress.trim().toLowerCase())
        .digest('hex');

    return (
        <Avatar>
            <AvatarImage
                src={`https://www.gravatar.com/avatar/${hashedEmail}?d=404`}
                alt={`${session.firstName} ${session.lastName}`}
            />
            <AvatarFallback>{`${session.firstName[0]} ${session.lastName[0]}`}</AvatarFallback>
            {children}
        </Avatar>
    );
}
