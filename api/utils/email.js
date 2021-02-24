import { format } from './string';
import { fetch } from './http';
import { base64Encode } from './encode';
import { config } from './config';

const url = `https://api.mailgun.net/v3/${config.MAILGUN_DOMAIN}/messages`;
const authorization = `Basic ${base64Encode(`api:${config.MAILGUN_APIKEY}`)}`;

export const sendEmail = message =>
    fetch({
        url,
        method: 'POST',
        headers: {
            authorization
        },
        body: {
            from: config.MAILGUN_NOREPLY,
            to: message.to,
            subject: format(message.subject, message.context),
            html: format(message.html, message.context)
        }
    });
