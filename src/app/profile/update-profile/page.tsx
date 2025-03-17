import { Metadata } from 'next';
import { getProfileAction } from '@/app/profile/actions/get-profile-action';
import { UpdateProfile } from '@/app/profile/update-profile/update-profile';
import {
    isServerActionSuccess,
    ServerActionError,
} from '@/components/server-action-error';

export const metadata: Metadata = {
    title: 'Update Profile',
};

export default async function UpdateProfilePage() {
    const result = await getProfileAction();

    if (!isServerActionSuccess(result)) {
        return <ServerActionError result={result} />;
    }

    return <UpdateProfile profile={result.data} />;
}
