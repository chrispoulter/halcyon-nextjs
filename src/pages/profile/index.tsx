import { GetServerSideProps } from 'next';
import { signOut } from 'next-auth/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Meta } from '@/components/meta';
import { Container } from '@/components/container';
import { Title } from '@/components/title';
import { PersonalDetailsCard } from '@/features/profile/components/personal-details-card';
import { LoginDetailsCard } from '@/features/profile/components/login-details-card';
import { AccountSettingsCard } from '@/features/profile/components/account-settings-card';
import {
    getProfile,
    useGetProfile
} from '@/features/profile/hooks/use-get-profile';
import { useDeleteAccount } from '@/features/profile/hooks/use-delete-account';
import { auth } from '@/lib/auth';

const ProfilePage = () => {
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

export const getServerSideProps: GetServerSideProps = async context => {
    const session = await auth(context);

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

export default ProfilePage;
