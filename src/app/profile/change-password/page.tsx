import { Metadata } from 'next';
import { getProfileAction } from '@/app/profile/actions/get-profile-action';
import { ChangePassword } from '@/app/profile/change-password/change-password';
import {
    isServerActionSuccess,
    ServerActionError,
} from '@/components/server-action-error';

export const metadata: Metadata = {
    title: 'Change Password',
};

export default async function ChangePasswordPage() {
    const result = await getProfileAction();

    if (!isServerActionSuccess(result)) {
        return <ServerActionError result={result} />;
    }

    return <ChangePassword profile={result.data} />;
}
