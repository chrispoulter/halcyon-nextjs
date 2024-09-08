import { GetProfileResponse } from '@/features/manage/manageTypes';
import { Card, CardTitle } from '@/components/card';
import { CardSkeleton } from '@/components/card-skeleton';
import { ButtonGroup } from '@/components/button-group';
import { ButtonLink } from '@/components/button-link';
import { toLocaleString } from '@/lib/dates';

type PersonalDetailsCardProps = {
    profile?: GetProfileResponse;
    className?: string;
};

const PersonalDetailsCardLoading = ({
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
                {toLocaleString(profile.dateOfBirth)}
            </p>

            <ButtonGroup align="left">
                <ButtonLink href="/update-profile" variant="primary">
                    Update Profile
                </ButtonLink>
            </ButtonGroup>
        </Card>
    );
};
