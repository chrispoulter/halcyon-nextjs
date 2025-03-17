import { Metadata } from 'next';
import { getProfileAction } from '@/app/profile/actions/get-profile-action';
import { Profile } from '@/app/profile/profile';
import {
    isServerActionSuccess,
    ServerActionError,
} from '@/components/server-action-error';

export const metadata: Metadata = {
    title: 'My Account',
};

export default async function ProfilePage() {
    const result = await getProfileAction();

    if (!isServerActionSuccess(result)) {
        return <ServerActionError result={result} />;
    }

    return <Profile profile={result.data} />;
}
