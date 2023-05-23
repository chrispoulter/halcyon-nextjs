import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signOut } from 'next-auth/react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import { PersonalDetailsCard } from '@/features/manage/PersonalDetailsCard/PersonalDetailsCard';
import { LoginDetailsCard } from '@/features/manage/LoginDetailsCard/LoginDetailsCard';
import { AccountSettingsCard } from '@/features/manage/AccountSettingsCard/AccountSettingsCard';
import { getProfile, useGetProfile } from '@/hooks/useGetProfile';
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

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//     const session = await getServerSession(req, res, authOptions);

//     const queryClient = new QueryClient();

//     await queryClient.prefetchQuery(['profile'], () =>
//         getProfile({
//             headers: {
//                 cookie: req.headers.cookie!
//             }
//         })
//     );

//     return {
//         props: {
//             session,
//             dehydratedState: dehydrate(queryClient)
//         }
//     };
// };

MyAccount.meta = {
    title: 'My Account'
};

MyAccount.auth = true;

export default MyAccount;
