import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import {
    getProfile,
    useGetProfileQuery,
    useChangePasswordMutation
} from '@/features/manage/manageEndpoints';
import { getRunningQueriesThunk } from '@/redux/api';
import { wrapper } from '@/redux/store';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title } from '@/components/Title/Title';
import { TextLink } from '@/components/TextLink/TextLink';
import { ButtonLink } from '@/components/Button/ButtonLink';
import {
    ChangePasswordForm,
    ChangePasswordFormValues
} from '@/features/manage/ChangePasswordForm/ChangePasswordForm';

const ChangePasswordPage = () => {
    const router = useRouter();

    const { data: session, status } = useSession();

    const { data: profile } = useGetProfileQuery(
        { accessToken: session?.accessToken },
        { skip: status === 'loading' }
    );

    const [changePassword] = useChangePasswordMutation();

    const version = profile?.version;

    const onSubmit = async (values: ChangePasswordFormValues) => {
        await changePassword({
            body: { ...values, version },
            accessToken: session?.accessToken
        }).unwrap();

        toast.success('Your password has been changed.');
        return router.push('/my-account');
    };

    return (
        <>
            <Meta title="Change Password" />

            <Container>
                <Title>Change Password</Title>

                <ChangePasswordForm
                    profile={profile}
                    onSubmit={onSubmit}
                    options={
                        <ButtonLink href="/my-account" variant="secondary">
                            Cancel
                        </ButtonLink>
                    }
                    className="mb-5"
                />

                <p className="text-sm text-gray-600">
                    Forgotten your password?{' '}
                    <TextLink href="/forgot-password">Request reset</TextLink>
                </p>
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

export default ChangePasswordPage;
