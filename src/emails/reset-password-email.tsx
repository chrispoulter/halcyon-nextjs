import {
    Html,
    Button,
    Body,
    Container,
    Head,
    Preview,
    Section,
    Text,
    Heading,
    Link,
} from '@react-email/components';

type ResetPasswordEmailProps = {
    resetPasswordUrl: string;
    siteUrl: string;
};

export function ResetPasswordEmail({
    resetPasswordUrl,
    siteUrl,
}: ResetPasswordEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Reset your password</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={heading}>Reset your password</Heading>
                    <Text style={paragraph}>
                        We have received a request to reset your password.
                    </Text>
                    <Text style={paragraph}>
                        In order to complete the process and select a new
                        password please click here:
                    </Text>
                    <Section style={buttonContainer}>
                        <Button style={button} href={resetPasswordUrl}>
                            Reset your password
                        </Button>
                    </Section>
                    <Text style={paragraph}>
                        <strong>Important</strong>: If you did not request a
                        password reset do not worry. Your account is still
                        secure and your old password will remain active.
                    </Text>
                    <Text style={paragraph}>
                        Regards,
                        <br />
                        <strong>Halcyon</strong>
                        <br />
                        <Link style={link} href={siteUrl}>
                            {siteUrl}
                        </Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

ResetPasswordEmail.PreviewProps = {
    siteUrl: 'http://localhost:3000',
    resetPasswordUrl: 'http://localhost:3000/account/reset-password/1234',
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;

const main = {
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
};

const heading = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#020817',
};

const paragraph = {
    fontSize: '14px',
    color: '#020817',
};

const link = {
    color: '#020817',
    textDecoration: 'underline',
};

const buttonContainer = {
    textAlign: 'center' as const,
};

const button = {
    backgroundColor: '#0f172a',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '16px 8px',
};
