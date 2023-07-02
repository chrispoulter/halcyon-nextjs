import { useRouter } from 'next/router';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import { BodyLink } from '@/components/BodyLink/BodyLink';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import {
    ChangePasswordForm,
    ChangePasswordFormValues
} from '@/features/manage/ChangePasswordForm/ChangePasswordForm';
import { useChangePassword } from '@/hooks/useChangePassword';
import { useGetProfile } from '@/hooks/useGetProfile';

const ChangePassword = () => {
    const router = useRouter();

    const { profile } = useGetProfile();

    const { changePassword } = useChangePassword();

    const onSubmit = async (values: ChangePasswordFormValues) => {
        try {
            await changePassword({ ...values, version: profile!.version });
            await router.push('/my-account');
        } catch (error) {
            console.warn(
                'An unhandled error was caught from onSubmit()',
                error
            );
        }
    };

    return (
        <Container>
            <PageTitle>Change Password</PageTitle>

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
                <BodyLink href="/forgot-password">Request reset</BodyLink>
            </p>
        </Container>
    );
};

ChangePassword.meta = {
    title: 'Change Password'
};

ChangePassword.auth = true;

export default ChangePassword;
