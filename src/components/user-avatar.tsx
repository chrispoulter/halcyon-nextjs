import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SessionPayload } from '@/lib/session-types';

type UserAvatarProps = {
    session: SessionPayload;
};

export function UserAvatar({ session }: UserAvatarProps) {
    return (
        <Avatar>
            <AvatarImage src={session.image} alt={session.name} />
            <AvatarFallback>{session.name[0]}</AvatarFallback>
        </Avatar>
    );
}
