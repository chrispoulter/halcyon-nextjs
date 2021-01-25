import { emailTemplates } from '../data/emailTemplates';
import { format } from './string';
import { fetch } from './http';
import { base64Encode } from './encode';
import { config } from './config';

const mailgunUrl = `https://api.mailgun.net/v3/${config.MAILGUN_DOMAIN}/messages`;
const mailgunAuth = `Basic ${base64Encode(`api:${config.MAILGUN_APIKEY}`)}`;

export const sendEmail = message => {
    const template = emailTemplates[message.template];
    const subject = format(template.subject, message.context);
    const html = format(template.html, message.context);

    return fetch({
        url: mailgunUrl,
        method: 'POST',
        headers: {
            Authorization: mailgunAuth
        },
        body: {
            from: config.MAILGUN_NOREPLY,
            to: message.to,
            subject,
            html
        }
    });
};
