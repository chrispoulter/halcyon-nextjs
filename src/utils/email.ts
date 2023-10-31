import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { renderTemplate } from './template';
import { config } from '@/utils/config';

type EmailMessage = {
    template: string;
    to: string;
    data: { [key: string]: any };
};

export const sendEmail = async (message: EmailMessage) => {
    console.info(
        `Sending email to ${message.to} with template ${message.template}`
    );

    const [html, subject] = await renderTemplate(
        message.template,
        message.data
    );

    const transport: SMTPTransport.Options = {
        host: config.EMAIL_SMTP_SERVER,
        port: config.EMAIL_SMTP_PORT
    };

    if (config.EMAIL_SMTP_USERNAME && config.EMAIL_SMTP_PASSWORD) {
        transport.auth = {
            user: config.EMAIL_SMTP_USERNAME,
            pass: config.EMAIL_SMTP_PASSWORD
        };
    }

    const transporter = nodemailer.createTransport(transport);

    try {
        await transporter.sendMail({
            to: message.to,
            from: config.EMAIL_NO_REPLY_ADDRESS,
            subject,
            html
        });
    } catch (error) {
        console.error('Email send failed', error);
    }
};
