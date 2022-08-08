import path from 'path';
import { promises as fs } from 'fs';
import nodemailer from 'nodemailer';
import { logger } from './logger';
import { config } from './config';

export const sendEmail = async message => {
    const template = await readResource(message.template);
    const title = getTitle(template);

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
            subject: replaceData(title, message.context),
            html: replaceData(template, message.context)
        });
    } catch (error) {
        logger.error(error);
    }
};

const readResource = resource =>
    fs.readFile(
        `${path.join(process.cwd(), 'src', 'templates')}/${resource}.html`,
        'utf8'
    );

const getTitle = template =>
    new RegExp(/<title>\s*(.+?)\s*<\/title>/).exec(template)[1];

const replaceData = (str, obj) => {
    let result = str;

    for (const [key, replaceValue] of Object.entries(obj)) {
        result = result.replace(new RegExp(`{{ ${key} }}`, 'g'), replaceValue);
    }

    return result;
};
