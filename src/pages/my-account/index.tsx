import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import {
    getProfile,
    useGetProfileQuery,
    useDeleteAccountMutation
} from '@/features/manage/manageEndpoints';
import { getRunningQueriesThunk } from '@/redux/api';
import { wrapper } from '@/redux/store';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title } from '@/components/Title/Title';
import { PersonalDetailsCard } from '@/features/manage/PersonalDetailsCard/PersonalDetailsCard';
import { LoginDetailsCard } from '@/features/manage/LoginDetailsCard/LoginDetailsCard';
import { AccountSettingsCard } from '@/features/manage/AccountSettingsCard/AccountSettingsCard';

const MyAccountPage = () => {
    const { data: session, status } = useSession();

    const { data: profile } = useGetProfileQuery(
        { accessToken: session?.accessToken },
        { skip: status === 'loading' }
    );

    const [deleteAccount, { isLoading: isDeleting }] =
        useDeleteAccountMutation();

    const version = profile?.version;

    const onDelete = async () => {
        await deleteAccount({
            body: { version },
            accessToken: session?.accessToken
        }).unwrap();

        toast.success('Your account has been deleted.');
        await signOut({ callbackUrl: '/' });
    };

    return (
        <>
            <Meta title="My Account" />

            <Container>
                <Title>My Account</Title>
                <PersonalDetailsCard profile={profile} className="mb-5" />
                <LoginDetailsCard profile={profile} className="mb-5" />

                <AccountSettingsCard
                    profile={profile}
                    isDeleting={isDeleting}
                    onDelete={onDelete}
                />
            </Container>
        </>
    );
};

export const getServerSideProps: GetServerSideProps =
    wrapper.getServerSideProps(store => async ({ req, res }) => {
        const session = await getServerSession(req, res, authOptions);

        store.dispatch(
            getProfile.initiate({ accessToken: session?.accessToken })
        );

        await Promise.all(store.dispatch(getRunningQueriesThunk()));

        return {
            props: {
                session
            }
        };
    });

export default MyAccountPage;
