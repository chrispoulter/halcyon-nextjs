import path from 'path';
import { promises as fs } from 'fs';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { config } from '@/utils/config';

type EmailMessage = {
    template: string;
    to: string;
    data: object;
};

export const sendEmail = async (message: EmailMessage) => {
    const template = await readResource(message.template);
    const html = render(template, message.data);
    const subject = getHtmlTitle(template);

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
        console.error('email error', error);
    }
};

const readResource = (resource: string) =>
    fs.readFile(
        `${path.join(process.cwd(), 'src', 'templates')}/${resource}`,
        'utf8'
    );

const getHtmlTitle = (template: string) =>
    new RegExp(/<title>\s*(.+?)\s*<\/title>/).exec(template)![1];

const render = (str: string, obj: object) => {
    let result = str;

    for (const [key, replaceValue] of Object.entries(obj)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), replaceValue);
    }

    return result;
};
