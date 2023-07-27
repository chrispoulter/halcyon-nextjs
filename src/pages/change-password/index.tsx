import { useRouter } from 'next/router';
import { useChangePasswordMutation, useGetProfileQuery } from '@/redux/api';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import { BodyLink } from '@/components/BodyLink/BodyLink';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import {
    ChangePasswordForm,
    ChangePasswordFormValues
} from '@/features/manage/ChangePasswordForm/ChangePasswordForm';

const ChangePassword = () => {
    const router = useRouter();

    const { data: profile } = useGetProfileQuery();

    const [changePassword] = useChangePasswordMutation();

    const version = profile?.data?.version;

    const onSubmit = async (values: ChangePasswordFormValues) => {
        await changePassword({
            ...values,
            version
        });

        await router.push('/my-account');
    };

    return (
        <Container>
            <PageTitle>Change Password</PageTitle>

            <ChangePasswordForm
                profile={profile?.data}
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
