import { TemplateRepository } from '../dataSources/templateRepository';
import { sendEmail } from '../utils/email';

export const sendEmailHandler = async data => {
    const templates = new TemplateRepository(true);

    const template = await templates.getByKey(data.template);
    if (!template) {
        throw new Error(`Unknown email template: ${data.template}`);
    }

    await sendEmail({
        to: data.to,
        subject: template.subject,
        html: template.html,
        context: data.context
    });
};
