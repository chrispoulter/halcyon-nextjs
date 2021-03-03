import { TemplateRepository } from '../dataSources/templateRepository';
import { captureError } from '../utils/logger';
import { sendEmail } from '../utils/email';

export const handler = async event => {
    console.log('handler', event?.Records[0]?.Sns?.Message);

    try {
        const message = event?.Records[0]?.Sns?.Message;
        const data = JSON.parse(message);

        const templates = new TemplateRepository();
        templates.initialize();

        const template = await templates.getTemplateByKey(data.template);

        // await sendEmail({
        //     subject: template.subject,
        //     html: template.html,
        //     ...data
        // });
    } catch (error) {
        captureError(error);
    }
};
