import { format } from './string';
import { fetch } from './http';
import { base64Encode } from './encode';
import { config } from './config';

const url = `https://api.mailgun.net/v3/${config.MAILGUN_DOMAIN}/messages`;
const authorization = `Basic ${base64Encode(`api:${config.MAILGUN_API_KEY}`)}`;

export const sendEmail = message => {
    const context = { ...message.context, clientUrl: config.CLIENT_URL };

    return fetch({
        url,
        method: 'POST',
        headers: {
            authorization
        },
        body: {
            from: config.MAILGUN_NO_REPLY,
            to: message.to,
            subject: format(message.subject, context),
            html: format(message.html, context)
        }
    });
};
