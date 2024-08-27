import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signOut } from 'next-auth/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
    getProfile,
    useGetProfile
} from '@/features/manage/hooks/useGetProfile';
import { useDeleteAccount } from '@/features/manage/hooks/useDeleteAccount';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title } from '@/components/Title/Title';
import { PersonalDetailsCard } from '@/features/manage/PersonalDetailsCard/PersonalDetailsCard';
import { LoginDetailsCard } from '@/features/manage/LoginDetailsCard/LoginDetailsCard';
import { AccountSettingsCard } from '@/features/manage/AccountSettingsCard/AccountSettingsCard';

const MyAccountPage = () => {
    const { data } = useGetProfile();

    const version = data?.version;

    const { mutate, isPending } = useDeleteAccount();

    const onDelete = () =>
        mutate(
            { version },
            {
                onSuccess: async () => {
                    toast.success('Your account has been deleted.');
                    await signOut({ callbackUrl: '/' });
                }
            }
        );

    return (
        <>
            <Meta title="My Account" />

            <Container>
                <Title>My Account</Title>
                <PersonalDetailsCard profile={data} className="mb-5" />
                <LoginDetailsCard profile={data} className="mb-5" />

                <AccountSettingsCard
                    profile={data}
                    isDeleting={isPending}
                    onDelete={onDelete}
                />
            </Container>
        </>
    );
};

export const _getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getServerSession(req, res, authOptions);

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['profile'],
        queryFn: () =>
            getProfile({
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                }
            })
    });

    return {
        props: {
            session,
            dehydratedState: dehydrate(queryClient)
        }
    };
};

export default MyAccountPage;
