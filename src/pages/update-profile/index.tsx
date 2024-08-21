import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title } from '@/components/Title/Title';
import { ButtonLink } from '@/components/Button/ButtonLink';
import {
    UpdateProfileForm,
    UpdateProfileFormValues
} from '@/features/manage/UpdateProfileForm/UpdateProfileForm';
import {
    getProfile,
    useGetProfile
} from '@/features/manage/hooks/useGetProfile';
import { useUpdateProfile } from '@/features/manage/hooks/useUpdateProfile';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const UpdateProfilePage = () => {
    const router = useRouter();

    const { profile } = useGetProfile();

    const { updateProfile } = useUpdateProfile();

    const version = profile?.version;

    const onSubmit = async (values: UpdateProfileFormValues) => {
        await updateProfile({ ...values, version });
        toast.success('Your profile has been updated.');
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getServerSession(req, res, authOptions);

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(['profile'], () =>
        getProfile({
            headers: {
                cookie: req.headers.cookie!
            }
        })
    );

    return {
        props: {
            session,
            dehydratedState: dehydrate(queryClient)
        }
    };
};

export default UpdateProfilePage;
