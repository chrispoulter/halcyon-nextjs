import nodemailer from 'nodemailer';
import { templateRepository } from '../data';
import { format } from './string';
import { config } from './config';

export const sendEmail = async message => {
    const template = await templateRepository.getByKey(message.template);

    if (!template) {
        throw new Error(`Unknown email template: ${message.template}`);
    }

    const transporter = nodemailer.createTransport({
        host: config.EMAIL_SMTP_SERVER,
        port: config.EMAIL_SMTP_PORT,
        secure: false,
        auth: {
            user: config.EMAIL_SMTP_USERNAME,
            pass: config.EMAIL_SMTP_PASSWORD
        }
    });

    await transporter.sendMail({
        from: config.EMAIL_NO_REPLY_ADDRESS,
        to: message.to,
        subject: format(template.subject, message.context),
        html: format(template.html, message.context)
    });
};
