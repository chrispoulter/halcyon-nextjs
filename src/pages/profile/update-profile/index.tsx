import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Meta } from '@/components/meta';
import { Container } from '@/components/container';
import { Title } from '@/components/title';
import { ButtonLink } from '@/components/button-link';
import {
    UpdateProfileForm,
    UpdateProfileFormValues
} from '@/features/profile/components/update-profile-form';
import {
    getProfile,
    useGetProfile
} from '@/features/profile/hooks/use-get-profile';
import { useUpdateProfile } from '@/features/profile/hooks/use-update-profile';
import { auth } from '@/lib/auth';

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
                    return router.push('/profile');
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
                        <ButtonLink href="/profile" variant="secondary">
                            Cancel
                        </ButtonLink>
                    }
                />
            </Container>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await auth(req, res);

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
