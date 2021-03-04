import { TemplateRepository } from '../dataSources/templateRepository';
import { captureError } from '../utils/logger';
import { sendEmail } from '../utils/email';

export const handler = async event => {
    try {
        const message = event?.Records[0]?.Sns?.Message;
        const data = JSON.parse(message);

        const templates = new TemplateRepository(true);
        const template = await templates.getTemplateByKey(data.template);

        await sendEmail({
            ...template,
            ...data
        });
    } catch (error) {
        captureError(error);
    }
};
