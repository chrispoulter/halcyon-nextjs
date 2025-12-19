import React from 'react';
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
    siteUrl: string;
    passwordResetToken: string;
};

export function ResetPasswordEmail({
    siteUrl,
    passwordResetToken,
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
                        <Button
                            style={button}
                            href={`${siteUrl}/account/reset-password/${passwordResetToken}`}
                        >
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
    passwordResetToken: 'B4276C117FCF0F7A7BB590E4AFB61343',
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;

const main: React.CSSProperties = {
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container: React.CSSProperties = {
    margin: '0 auto',
    padding: '20px 0 48px',
};

const heading: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#020817',
};

const paragraph: React.CSSProperties = {
    fontSize: '14px',
    color: '#020817',
};

const link: React.CSSProperties = {
    color: '#020817',
    textDecoration: 'underline',
};

const buttonContainer: React.CSSProperties = {
    textAlign: 'center',
};

const button: React.CSSProperties = {
    backgroundColor: '#0f172a',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'block',
    padding: '16px 8px',
};
