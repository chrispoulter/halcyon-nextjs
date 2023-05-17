import { GetProfileResponse } from '@/models/manage.types';
import { Card, CardBody, CardTitle } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { CardSkeleton } from '@/components/Skeleton/Skeleton';
import { ConfirmDeleteAccount } from '@/features/manage/ConfirmDeleteAccount/ConfirmDeleteAccount';

type AccountSettingsCardProps = {
    profile?: GetProfileResponse;
    isDeleting: boolean;
    onDelete: () => void;
};

export const AccountSettingsCard = ({
    profile,
    isDeleting,
    onDelete
}: AccountSettingsCardProps) => {
    if (!profile) {
        return (
            <CardSkeleton>
                <div className="h-5 w-full bg-gray-100" />
            </CardSkeleton>
        );
    }

    return (
        <Card>
            <CardTitle>Settings</CardTitle>
            <CardBody>
                Once you delete your account all of your data and settings will
                be removed. Please be certain.
            </CardBody>
            <ButtonGroup align="left">
                <ConfirmDeleteAccount onConfirm={onDelete}>
                    <Button variant="danger" loading={isDeleting}>
                        Delete Account
                    </Button>
                </ConfirmDeleteAccount>
            </ButtonGroup>
        </Card>
    );
};
