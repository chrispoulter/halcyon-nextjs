import nodemailer from 'nodemailer';
import * as templateRepository from '../data/templateRepository';
import { format } from '../utils/string';
import * as logger from '../utils/logger';
import { config } from '../utils/config';

export const sendEmail = async message => {
    const template = await templateRepository.getByKey(message.template);

    const transport = {
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
            from: message.from || config.EMAIL_NO_REPLY_ADDRESS,
            to: message.to,
            subject: format(template.subject, message.context),
            html: format(template.html, message.context)
        });
    } catch (error) {
        logger.error('Email send failed', error);
    }
};
