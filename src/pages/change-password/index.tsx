import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title } from '@/components/Title/Title';
import { TextLink } from '@/components/TextLink/TextLink';
import { ButtonLink } from '@/components/Button/ButtonLink';
import {
    ChangePasswordForm,
    ChangePasswordFormValues
} from '@/features/manage/ChangePasswordForm/ChangePasswordForm';
import { useGetProfile } from '@/features/manage/hooks/useGetProfile';
import { useChangePassword } from '@/features/manage/hooks/useChangePassword';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const ChangePasswordPage = () => {
    const router = useRouter();

    const { profile } = useGetProfile();

    const { changePassword } = useChangePassword();

    const version = profile?.version;

    const onSubmit = async (values: ChangePasswordFormValues) => {
        await changePassword({ ...values, version });
        toast.success('Your password has been changed.');
        await router.push('/my-account');
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

export const _getServerSideProps: GetServerSideProps = async ({
    req,
    res
}) => ({
    props: {
        session: await getServerSession(req, res, authOptions)
    }
});

export default ChangePasswordPage;
