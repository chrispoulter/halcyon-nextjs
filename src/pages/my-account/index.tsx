import { signOut } from 'next-auth/react';
import { useDeleteAccountMutation, useGetProfileQuery } from '@/redux/api';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import { PersonalDetailsCard } from '@/features/manage/PersonalDetailsCard/PersonalDetailsCard';
import { LoginDetailsCard } from '@/features/manage/LoginDetailsCard/LoginDetailsCard';
import { AccountSettingsCard } from '@/features/manage/AccountSettingsCard/AccountSettingsCard';

import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { getRunningQueriesThunk, getProfile } from '@/redux/api';
import { wrapper } from '@/redux/store';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const MyAccountPage = () => {
    const { data: profile } = useGetProfileQuery();

    const [deleteAccount, { isLoading: isDeleting }] =
        useDeleteAccountMutation();

    const version = profile?.data?.version;

    const onDelete = async () => {
        await deleteAccount({ version }).unwrap();
        await signOut({ callbackUrl: '/' });
    };

    return (
        <>
            <Meta title="My Account" />

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
