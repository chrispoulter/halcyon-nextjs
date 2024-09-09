import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Meta } from '@/components/meta';
import { Container } from '@/components/container';
import { Title } from '@/components/title';
import { TextLink } from '@/components/text-link';
import {
    LoginForm,
    LoginFormValues
} from '@/features/account/components/login-form';

const LoginPage = () => {
    const router = useRouter();
    const callbackUrl = (router.query.callbackUrl as string) || '/';

    const onSubmit = async (values: LoginFormValues) => {
        const signInResult = await signIn('credentials', {
            ...values,
            callbackUrl,
            redirect: false
        });

        if (signInResult?.ok) {
            return router.push(signInResult.url!);
        }

        return toast.error('The credentials provided were invalid.');
    };

    return (
        <>
            <Meta title="Login" />

            <Container>
                <Title>Login</Title>
                <LoginForm onSubmit={onSubmit} className="mb-5" />

                <p className="text-sm leading-loose text-gray-600">
                    Not already a member?{' '}
                    <TextLink href="/register">Register now</TextLink>
                    <br />
                    Forgotten your password?{' '}
                    <TextLink href="/forgot-password">Request reset</TextLink>
                </p>
            </Container>
        </>
    );
};

export default LoginPage;
