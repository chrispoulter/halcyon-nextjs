import { SMTPClient } from 'emailjs';
import { render } from '@react-email/components';
import { config } from '@/lib/config';

type EmailMessage = {
    from?: string;
    to: string;
    subject: string;
    react: React.ReactElement;
};

export const sendEmail = async (message: EmailMessage) => {
    const html = await render(message.react);

    const text = await render(message.react, {
        plainText: true,
    });

    const client = new SMTPClient({
        host: config.EMAIL_SMTP_SERVER,
        port: config.EMAIL_SMTP_PORT,
        ssl: config.EMAIL_SMTP_SSL,
        user: config.EMAIL_SMTP_USERNAME,
        password: config.EMAIL_SMTP_PASSWORD,
    });

    try {
        await client.sendAsync({
            from: message.from || config.EMAIL_NO_REPLY_ADDRESS,
            to: message.to,
            subject: message.subject,
            text,
            attachment: [
                {
                    data: html,
                    alternative: true,
                },
            ],
        });
    } catch (error) {
        console.error('Email error', error);
    }
};
