import { signOut } from 'next-auth/react';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import { PersonalDetailsCard } from '@/features/manage/PersonalDetailsCard/PersonalDetailsCard';
import { LoginDetailsCard } from '@/features/manage/LoginDetailsCard/LoginDetailsCard';
import { AccountSettingsCard } from '@/features/manage/AccountSettingsCard/AccountSettingsCard';
import { useGetProfile } from '@/hooks/useGetProfile';
import { useDeleteAccount } from '@/hooks/useDeleteAccount';

const MyAccount = () => {
    const { profile } = useGetProfile();

    const { deleteAccount, isDeleting } = useDeleteAccount();

    const onDelete = async () => {
        await deleteAccount();
        signOut({ callbackUrl: '/' });
    };

    return (
        <Container>
            <PageTitle>My Account</PageTitle>
            <PersonalDetailsCard profile={profile} className="mb-5" />
            <LoginDetailsCard profile={profile} className="mb-5" />

            <AccountSettingsCard
                profile={profile}
                isDeleting={isDeleting}
                onDelete={onDelete}
            />
        </Container>
    );
};

MyAccount.meta = {
    title: 'My Account'
};

MyAccount.auth = true;

export default MyAccount;
