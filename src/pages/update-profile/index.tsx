import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import {
    getProfile,
    useGetProfileQuery,
    useUpdateProfileMutation
} from '@/features/manage/manageEndpoints';
import { getRunningQueriesThunk } from '@/redux/api';
import { wrapper } from '@/redux/store';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title } from '@/components/Title/Title';
import { ButtonLink } from '@/components/Button/ButtonLink';
import {
    UpdateProfileForm,
    UpdateProfileFormValues
} from '@/features/manage/UpdateProfileForm/UpdateProfileForm';

const UpdateProfilePage = () => {
    const router = useRouter();

    const { data: session, status } = useSession();

    const { data: profile } = useGetProfileQuery(
        { accessToken: session?.accessToken },
        { skip: status === 'loading' }
    );

    const [updateProfile] = useUpdateProfileMutation();

    const version = profile?.version;

    const onSubmit = async (values: UpdateProfileFormValues) => {
        await updateProfile({
            body: { ...values, version },
            accessToken: session?.accessToken
        }).unwrap();

        toast.success('Your profile has been updated.');
        return router.push('/my-account');
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

        if (!session) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false
                }
            };
        }

        const accessToken = session.accessToken;

        store.dispatch(getProfile.initiate({ accessToken }));
        await Promise.all(store.dispatch(getRunningQueriesThunk()));

        return {
            props: {
                session
            }
        };
    });

export default UpdateProfilePage;
