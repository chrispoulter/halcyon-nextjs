import path from 'path';
import { SMTPClient } from 'emailjs';
import { promises as fs } from 'fs';
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
    const html = replaceData(template, message.context);

    const title = getTitle(template);
    const subject = replaceData(title, message.context);

    const client = new SMTPClient({
        host: config.EMAIL_SMTP_SERVER,
        port: config.EMAIL_SMTP_PORT,
        user: config.EMAIL_SMTP_USERNAME,
        password: config.EMAIL_SMTP_PASSWORD
    });

    try {
        await client.sendAsync({
            from: message.from || config.EMAIL_NO_REPLY_ADDRESS,
            to: message.to,
            subject,
            text: html,
            attachment: [
                {
                    data: html,
                    alternative: true
                }
            ]
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
