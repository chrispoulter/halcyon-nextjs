import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
    getProfile,
    useGetProfile
} from '@/features/manage/hooks/useGetProfile';
import { useUpdateProfile } from '@/features/manage/hooks/useUpdateProfile';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Meta } from '@/components/meta';
import { Container } from '@/components/container';
import { Title } from '@/components/title';
import { ButtonLink } from '@/components/button-link';
import {
    UpdateProfileForm,
    UpdateProfileFormValues
} from '@/features/manage/components/update-profile-form';

const UpdateProfilePage = () => {
    const router = useRouter();

    const { data } = useGetProfile();

    const version = data?.version;

    const { mutate, isPending } = useUpdateProfile();

    const onSubmit = (values: UpdateProfileFormValues) =>
        mutate(
            { ...values, version },
            {
                onSuccess: async () => {
                    toast.success('Your profile has been updated.');
                    return router.push('/my-account');
                }
            }
        );

    return (
        <>
            <Meta title="Update Profile" />

            <Container>
                <Title>Update Profile</Title>

                <UpdateProfileForm
                    profile={data}
                    isLoading={isPending}
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

export default UpdateProfilePage;
