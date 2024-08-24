import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title } from '@/components/Title/Title';
import { TextLink } from '@/components/TextLink/TextLink';
import { LoginForm } from '@/features/account/LoginForm/LoginForm';
import { useSignIn } from '@/features/account/hooks/useSignIn';

const LoginPage = () => {
    const signIn = useSignIn();

    return (
        <>
            <Meta title="Login" />

            <Container>
                <Title>Login</Title>
                <LoginForm onSubmit={signIn} className="mb-5" />

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
