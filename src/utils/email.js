const emailTemplates = require('../data/emailTemplates');
const { format } = require('./string');
const { fetch } = require('./http');
const { base64Encode } = require('./encode');
const config = require('./config');

const mailgunUrl = `https://api.mailgun.net/v3/${config.MAILGUN_DOMAIN}/messages`;
const mailgunAuth = `Basic ${base64Encode(`api:${config.MAILGUN_APIKEY}`)}`;

module.exports.sendEmail = message => {
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
