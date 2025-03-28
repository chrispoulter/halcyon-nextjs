import path from 'path';
import { promises as fs } from 'fs';
import { SMTPClient } from 'emailjs';
import { config } from '@/lib/config';
import { getSiteUrl } from '@/lib/server-utils';

export enum EmailTemplate {
    ResetPassword = 'RESET_PASSWORD',
}

type EmailMessage = {
    from?: string;
    to: string;
    template: EmailTemplate;
    context: object;
};

const TEMPLATES_PATH = 'public/templates';

export const sendEmail = async (message: EmailMessage) => {
    const template = await readResource(message.template);
    const title = getTitle(template);

    const cdnUrl = await getSiteUrl();
    const data = { ...message.context, cdnUrl };

    const subject = replaceData(title, data);
    const body = replaceData(template, data);

    const client = new SMTPClient({
        host: config.EMAIL_SMTP_SERVER,
        port: config.EMAIL_SMTP_PORT,
        ssl: config.EMAIL_SMTP_SSL,
        user: config.EMAIL_SMTP_USERNAME,
        password: config.EMAIL_SMTP_PASSWORD,
    });

    try {
        await client.sendAsync({
            from: message.from || config.EMAIL_NO_REPLY_ADDRESS,
            to: message.to,
            subject,
            text: body,
            attachment: [
                {
                    data: body,
                    alternative: true,
                },
            ],
        });
    } catch (error) {
        console.error('email error', error);
    }
};

const readResource = (resource: string) =>
    fs.readFile(path.resolve(`${TEMPLATES_PATH}/${resource}.html`), 'utf8');

const getTitle = (template: string) =>
    new RegExp(/<title>\s*(.+?)\s*<\/title>/).exec(template)![1];

const replaceData = (str: string, obj: object) => {
    let result = str;

    for (const [key, replaceValue] of Object.entries(obj)) {
        result = result.replace(new RegExp(`{{ ${key} }}`, 'g'), replaceValue);
    }

    return result;
};
