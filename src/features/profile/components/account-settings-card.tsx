import { Card, CardBody, CardTitle } from '@/components/card';
import { CardSkeleton } from '@/components/card-skeleton';
import { ButtonGroup } from '@/components/button-group';
import { ConfirmDeleteAccount } from '@/features/profile/components/confirm-delete-account';
import { GetProfileResponse } from '@/features/profile/profile-types';

type AccountSettingsCardProps = {
    profile?: GetProfileResponse;
    isDeleting: boolean;
    onDelete: () => void;
};

const AccountSettingsCardLoading = () => (
    <CardSkeleton>
        <div className="h-5 w-full bg-gray-100" />
    </CardSkeleton>
);

export const AccountSettingsCard = ({
    profile,
    isDeleting,
    onDelete
}: AccountSettingsCardProps) => {
    if (!profile) {
        return <AccountSettingsCardLoading />;
    }

    return (
        <Card>
            <CardTitle>Settings</CardTitle>
            <CardBody>
                Once you delete your account all of your data and settings will
                be removed. Please be certain.
            </CardBody>
            <ButtonGroup align="left">
                <ConfirmDeleteAccount
                    onConfirm={onDelete}
                    loading={isDeleting}
                />
            </ButtonGroup>
        </Card>
    );
};
