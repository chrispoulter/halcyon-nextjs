import path from 'path';
import { promises as fs } from 'fs';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { config } from '@/utils/config';

export enum EmailTemplate {
    ResetPassword = 'RESET_PASSWORD'
}

type EmailMessage = {
    from?: string;
    to: string;
    template: EmailTemplate;
    context: object;
};

export const sendEmail = async (message: EmailMessage) => {
    const template = await readResource(message.template);
    const title = getTitle(template);

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
            from: message.from || config.EMAIL_NO_REPLY_ADDRESS,
            to: message.to,
            subject: replaceData(title, message.context),
            html: replaceData(template, message.context)
        });
    } catch (error) {
        console.error('email error', error);
    }
};

const readResource = (resource: string) =>
    fs.readFile(
        `${path.join(process.cwd(), 'src', 'templates')}/${resource}.html`,
        'utf8'
    );

const getTitle = (template: string) =>
    new RegExp(/<title>\s*(.+?)\s*<\/title>/).exec(template)![1];

const replaceData = (str: string, obj: object) => {
    let result = str;

    for (const [key, replaceValue] of Object.entries(obj)) {
        result = result.replace(new RegExp(`{{ ${key} }}`, 'g'), replaceValue);
    }

    return result;
};
