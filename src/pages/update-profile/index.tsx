import { useRouter } from 'next/router';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/redux/api';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import {
    UpdateProfileForm,
    UpdateProfileFormValues
} from '@/features/manage/UpdateProfileForm/UpdateProfileForm';

import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { getRunningQueriesThunk, getProfile } from '@/redux/api';
import { wrapper } from '@/redux/store';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const UpdateProfile = () => {
    const router = useRouter();

    const { data: profile } = useGetProfileQuery();

    const [updateProfile] = useUpdateProfileMutation();

    const version = profile?.data?.version;

    const onSubmit = async (values: UpdateProfileFormValues) => {
        await updateProfile({ ...values, version }).unwrap();
        await router.push('/my-account');
    };

    return (
        <Container>
            <PageTitle>Update Profile</PageTitle>

            <UpdateProfileForm
                profile={profile?.data}
                onSubmit={onSubmit}
                options={
                    <ButtonLink href="/my-account" variant="secondary">
                        Cancel
                    </ButtonLink>
                }
            />
        </Container>
    );
};

export const getServerSideProps: GetServerSideProps =
    wrapper.getServerSideProps(store => async ({ req, res }) => {
        const session = await getServerSession(req, res, authOptions);

        if (!session?.user) {
            res.statusCode = 401;
            return {
                props: {
                    session
                }
            };
        }

        store.dispatch(getProfile.initiate());

        await Promise.all(store.dispatch(getRunningQueriesThunk()));

        return {
            props: {
                session
            }
        };
    });

UpdateProfile.meta = {
    title: 'Update Profile'
};

UpdateProfile.auth = true;

export default UpdateProfile;
