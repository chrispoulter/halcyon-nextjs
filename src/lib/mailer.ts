import nodemailer from 'nodemailer';
import { render } from 'react-email';
import { config } from './config';

const transporter = nodemailer.createTransport({
    host: config.EMAIL_SMTP_SERVER,
    port: config.EMAIL_SMTP_PORT,
    secure: config.EMAIL_SMTP_SSL,
    auth:
        config.EMAIL_SMTP_USERNAME && config.EMAIL_SMTP_PASSWORD
            ? {
                  user: config.EMAIL_SMTP_USERNAME,
                  pass: config.EMAIL_SMTP_PASSWORD,
              }
            : undefined,
});

export async function check(): Promise<{
    service: string;
    status: 'ok' | 'unhealthy';
}> {
    try {
        await transporter.verify();
        return { service: 'mailer', status: 'ok' };
    } catch (error) {
        console.error('Mailer health check failed', error);
        return { service: 'mailer', status: 'unhealthy' };
    }
}

interface MailMessage {
    to: string;
    subject: string;
    template: React.ReactElement;
}

export async function sendMail(message: MailMessage) {
    const html = await render(message.template);

    try {
        await transporter.sendMail({
            from: config.EMAIL_NO_REPLY_ADDRESS,
            to: message.to,
            subject: message.subject,
            html,
        });
    } catch (error) {
        console.error('Mail sending failed', error);
    }
}
