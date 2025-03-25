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
