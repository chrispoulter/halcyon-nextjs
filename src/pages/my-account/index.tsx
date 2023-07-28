import { signOut } from 'next-auth/react';
import { useDeleteAccountMutation, useGetProfileQuery } from '@/redux/api';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import { PersonalDetailsCard } from '@/features/manage/PersonalDetailsCard/PersonalDetailsCard';
import { LoginDetailsCard } from '@/features/manage/LoginDetailsCard/LoginDetailsCard';
import { AccountSettingsCard } from '@/features/manage/AccountSettingsCard/AccountSettingsCard';

const MyAccount = () => {
    const { data: profile } = useGetProfileQuery();

    const [deleteAccount, { isLoading: isDeleting }] =
        useDeleteAccountMutation();

    const version = profile?.data?.version;

    const onDelete = async () => {
        await deleteAccount({ version }).unwrap();
        await signOut({ callbackUrl: '/' });
    };

    return (
        <Container>
            <PageTitle>My Account</PageTitle>
            <PersonalDetailsCard profile={profile?.data} className="mb-5" />
            <LoginDetailsCard profile={profile?.data} className="mb-5" />

            <AccountSettingsCard
                profile={profile?.data}
                isDeleting={isDeleting}
                onDelete={onDelete}
            />
        </Container>
    );
};

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//     const session = await getServerSession(req, res, authOptions);

//     const queryClient = new QueryClient();

//     const baseUrl = getBaseUrl(req);

//     await queryClient.prefetchQuery(['profile'], () =>
//         getProfile(
//             {
//                 headers: {
//                     cookie: req.headers.cookie!
//                 }
//             },
//             baseUrl
//         )
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
