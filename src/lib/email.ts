import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import { config } from '@/lib/config';

type EmailMessage = {
    from?: string;
    to: string;
    subject: string;
    react: React.ReactElement;
};

export async function sendEmail(message: EmailMessage) {
    const html = await render(message.react);

    const transporter = nodemailer.createTransport({
        host: config.EMAIL_SMTP_SERVER,
        port: config.EMAIL_SMTP_PORT,
        secure: config.EMAIL_SMTP_SSL,
        auth: {
            user: config.EMAIL_SMTP_USERNAME,
            pass: config.EMAIL_SMTP_PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: message.from || config.EMAIL_NO_REPLY_ADDRESS,
            to: message.to,
            subject: message.subject,
            html,
        });
    } catch (error) {
        console.error('Email error', error);
    }
}
