import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import { BodyLink } from '@/components/BodyLink/BodyLink';
import {
    LoginForm,
    LoginFormValues
} from '@/features/account/LoginForm/LoginForm';

const LoginPage = () => {
    const router = useRouter();

    const callbackUrl = router.query.callbackUrl as string;

    const onSubmit = async (values: LoginFormValues) => {
        const result = await signIn('credentials', {
            ...values,
            redirect: false,
            callbackUrl: callbackUrl || '/'
        });

        if (!result?.ok) {
            toast.error(
                result?.error ||
                    'Sorry, something went wrong. Please try again later.'
            );
            return;
        }

        await router.push(result.url!);
    };

    return (
        <>
            <Meta title="Login" />

            <Container>
                <PageTitle>Login</PageTitle>
                <LoginForm onSubmit={onSubmit} className="mb-5" />

                <p className="text-sm leading-loose text-gray-600">
                    Not already a member?{' '}
                    <BodyLink href="/register">Register now</BodyLink>
                    <br />
                    Forgotten your password?{' '}
                    <BodyLink href="/forgot-password">Request reset</BodyLink>
                </p>
            </Container>
        </>
    );
};

export default LoginPage;
