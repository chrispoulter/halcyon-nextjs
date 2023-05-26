import { GetProfileResponse } from '@/models/manage.types';
import { Card, CardTitle } from '@/components/Card/Card';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import { CardSkeleton } from '@/components/Skeleton/Skeleton';
import { toDisplayString } from '@/utils/date';

type PersonalDetailsCardProps = {
    profile?: GetProfileResponse;
    className?: string;
};

export const PersonalDetailsCardLoading = ({
    className
}: PersonalDetailsCardProps) => (
    <CardSkeleton className={className}>
        <div className="mb-2 h-5 w-4/12 bg-gray-200" />
        <div className="mb-3 h-5 w-6/12 bg-gray-100" />
        <div className="mb-2 h-5 w-4/12 bg-gray-200" />
        <div className="mb-3 h-5 w-6/12 bg-gray-100" />
        <div className="mb-2 h-5 w-4/12 bg-gray-200" />
        <div className="mb-3 h-5 w-6/12 bg-gray-100" />
    </CardSkeleton>
);

export const PersonalDetailsCard = ({
    profile,
    className
}: PersonalDetailsCardProps) => {
    if (!profile) {
        return <PersonalDetailsCardLoading className={className} />;
    }

    return (
        <Card className={className}>
            <CardTitle>Personal Details</CardTitle>

            <p className="mb-1 text-sm font-medium text-gray-800">
                Email Address
            </p>
            <p className="mb-3 line-clamp-2 break-words text-sm text-gray-500">
                {profile.emailAddress}
            </p>

            <p className="mb-1 text-sm font-medium text-gray-800">Name</p>
            <p className="mb-3 line-clamp-2 break-words text-sm text-gray-500">
                {profile.firstName} {profile.lastName}
            </p>

            <p className="mb-1 text-sm font-medium text-gray-800">
                Date Of Birth
            </p>
            <p className="mb-3 text-sm text-gray-500">
                {toDisplayString(profile.dateOfBirth)}
            </p>

            <ButtonGroup align="left">
                <ButtonLink href="/update-profile" variant="primary">
                    Update Profile
                </ButtonLink>
            </ButtonGroup>
        </Card>
    );
};
