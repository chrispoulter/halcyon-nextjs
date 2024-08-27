import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import {
    useGetProfileQuery,
    useDeleteAccountMutation
} from '@/features/manage/manageEndpoints';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title } from '@/components/Title/Title';
import { PersonalDetailsCard } from '@/features/manage/PersonalDetailsCard/PersonalDetailsCard';
import { LoginDetailsCard } from '@/features/manage/LoginDetailsCard/LoginDetailsCard';
import { AccountSettingsCard } from '@/features/manage/AccountSettingsCard/AccountSettingsCard';

import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { getRunningQueriesThunk } from '@/redux/api';
import { getProfile } from '@/features/manage/manageEndpoints';
import { wrapper } from '@/redux/store';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const MyAccountPage = () => {
    const { data: profile } = useGetProfileQuery();

    const version = profile?.version;

    const [deleteAccount, { isLoading: isDeleting }] =
        useDeleteAccountMutation();

    const onDelete = async () => {
        await deleteAccount({ version }).unwrap();
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

        store.dispatch(getProfile.initiate());

        await Promise.all(store.dispatch(getRunningQueriesThunk()));

        return {
            props: {
                session
            }
        };
    });

export default MyAccountPage;
