import { format } from './string';
import { fetch } from './http';
import { base64Encode } from './encode';
import { config } from './config';

const url = `https://api.mailgun.net/v3/${config.MAILGUN_DOMAIN}/messages`;
const authorization = `Basic ${base64Encode(`api:${config.MAILGUN_APIKEY}`)}`;

const templates = {
    RESET_PASSWORD: {
        subject: 'Password Reset // Halcyon',
        html:
            '<html><head><title>Halcyon</title></head><body><p style="font-family: verdana, geneva, sans-serif; font-size: 11px;">We have received a request to reset your password.</p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px;">In order to complete the process and select a new password please click here:</p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px;"><a href="https://halcyon.chrispoulter.com/reset-password/{token}">Reset your password</a></p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px;"><strong>Important</strong>: If you did not request a password reset do not worry. Your account is still secure and your old password will remain active.</p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px;">Regards,<br /><strong>Halcyon</strong><br /><a href="https://halcyon.chrispoulter.com">https://halcyon.chrispoulter.com</a></p></body></html>'
    }
};

export const sendEmail = message => {
    const template = templates[message.template];
    const subject = format(template.subject, message.context);
    const html = format(template.html, message.context);

    return fetch({
        url,
        method: 'POST',
        headers: {
            authorization
        },
        body: {
            from: config.MAILGUN_NOREPLY,
            to: message.to,
            subject,
            html
        }
    });
};
