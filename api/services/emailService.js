import nodemailer from 'nodemailer';
import { templateRepository } from '../data';
import { format } from '../utils/string';
import { logger } from '../utils/logger';
import { config } from '../utils/config';

export const sendEmail = async message => {
    const template = await templateRepository.getByKey(message.template);

    const transporter = nodemailer.createTransport({
        host: config.EMAIL_SMTP_SERVER,
        port: config.EMAIL_SMTP_PORT,
        auth: {
            user: config.EMAIL_SMTP_USERNAME,
            pass: config.EMAIL_SMTP_PASSWORD
        }
    });

    try {
        await transporter.sendMail({
            from: config.EMAIL_NO_REPLY_ADDRESS,
            to: message.to,
            subject: format(template.subject, message.context),
            html: format(template.html, message.context)
        });
    } catch (error) {
        logger.error('Email Send Failed', error);
    }
};
