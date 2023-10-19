import { useRouter } from 'next/router';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/redux/api';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title } from '@/components/Title/Title';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import {
    UpdateProfileForm,
    UpdateProfileFormValues
} from '@/features/manage/UpdateProfileForm/UpdateProfileForm';

import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { getProfile, getRunningQueriesThunk } from '@/redux/api';
import { wrapper } from '@/redux/store';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const UpdateProfilePage = () => {
    const router = useRouter();

    const { data: profile } = useGetProfileQuery();

    const [updateProfile] = useUpdateProfileMutation();

    const version = profile?.version;

    const onSubmit = async (values: UpdateProfileFormValues) => {
        await updateProfile({ ...values, version }).unwrap();
        await router.push('/my-account');
    };

    return (
        <>
            <Meta title="Update Profile" />

            <Container>
                <Title>Update Profile</Title>

                <UpdateProfileForm
                    profile={profile}
                    onSubmit={onSubmit}
                    options={
                        <ButtonLink href="/my-account" variant="secondary">
                            Cancel
                        </ButtonLink>
                    }
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

export default UpdateProfilePage;
