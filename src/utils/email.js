const emailTemplates = require('../emailTemplates');
const { fetch } = require('./http');
const { format, base64Encode } = require('./string');
const config = require('./config');

module.exports.sendEmail = message => {
    const template = emailTemplates[message.template];
    const subject = format(template.subject, message.context);
    const html = format(template.html, message.context);

    return fetch({
        url: `https://api.eu.mailgun.net/v3/${config.MAILGUN_DOMAIN}/messages`,
        method: 'POST',
        headers: {
            Authorization: `Basic ${base64Encode(
                `api:${config.MAILGUN_PASSWORD}`
            )}`
        },
        body: {
            from: config.MAILGUN_NOREPLY,
            to: message.to,
            subject,
            html
        }
    });
};
