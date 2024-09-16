import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Meta } from '@/components/meta';
import { Container } from '@/components/container';
import { Title } from '@/components/title';
import { TextLink } from '@/components/text-link';
import { ButtonLink } from '@/components/button-link';
import {
    ChangePasswordForm,
    ChangePasswordFormValues
} from '@/features/profile/components/change-password-form';
import {
    getProfile,
    useGetProfile
} from '@/features/profile/hooks/use-get-profile';
import { useChangePassword } from '@/features/profile/hooks/use-change-password';
import { auth } from '@/lib/auth';

const ChangePasswordPage = () => {
    const router = useRouter();

    const { data } = useGetProfile();

    const version = data?.version;

    const { mutate, isPending } = useChangePassword();

    const onSubmit = (values: ChangePasswordFormValues) =>
        mutate(
            { ...values, version },
            {
                onSuccess: async () => {
                    toast.success('Your password has been changed.');
                    return router.push('/profile');
                }
            }
        );

    return (
        <>
            <Meta title="Change Password" />

            <Container>
                <Title>Change Password</Title>

                <ChangePasswordForm
                    profile={data}
                    isLoading={isPending}
                    onSubmit={onSubmit}
                    options={
                        <ButtonLink href="/profile" variant="secondary">
                            Cancel
                        </ButtonLink>
                    }
                    className="mb-5"
                />

                <p className="text-sm text-gray-600">
                    Forgotten your password?{' '}
                    <TextLink href="/account/forgot-password">
                        Request reset
                    </TextLink>
                </p>
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

export default ChangePasswordPage;
