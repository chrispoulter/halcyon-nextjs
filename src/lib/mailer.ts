import nodemailer from 'nodemailer';
import { render } from 'react-email';
import { config } from './config';
import { logger } from './logger';
import { tracer, emailSendDuration } from './telemetry';

const transporter = nodemailer.createTransport({
    host: config.EMAIL_SMTP_SERVER,
    port: config.EMAIL_SMTP_PORT,
    secure: config.EMAIL_SMTP_SSL,
    auth:
        config.EMAIL_SMTP_USERNAME && config.EMAIL_SMTP_PASSWORD
            ? {
                  user: config.EMAIL_SMTP_USERNAME,
                  pass: config.EMAIL_SMTP_PASSWORD,
              }
            : undefined,
});

export async function check(): Promise<{
    service: string;
    status: 'ok' | 'unhealthy';
}> {
    try {
        await transporter.verify();
        return { service: 'mailer', status: 'ok' };
    } catch (error) {
        logger.error('Mailer health check failed', error);
        return { service: 'mailer', status: 'unhealthy' };
    }
}

interface MailMessage {
    to: string;
    subject: string;
    template: React.ReactElement;
}

export async function sendMail(message: MailMessage) {
    const html = await render(message.template);

    await tracer.startActiveSpan('email.send', async (span) => {
        span.setAttribute('email.subject', message.subject);
        const start = performance.now();

        try {
            await transporter.sendMail({
                from: config.EMAIL_NO_REPLY_ADDRESS,
                to: message.to,
                subject: message.subject,
                html,
            });
            emailSendDuration.record(performance.now() - start, {
                outcome: 'success',
            });
        } catch (error) {
            emailSendDuration.record(performance.now() - start, {
                outcome: 'failure',
            });
            logger.error('Mail sending failed', error);
        } finally {
            span.end();
        }
    });
}
