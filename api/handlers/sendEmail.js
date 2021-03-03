import { TemplateRepository } from '../dataSources/templateRepository';
import { sendEmail } from '../utils/email';

export const handler = async event => {
    try {
        const message = event?.Records[0]?.Sns?.Message;
        const data = JSON.parse(message);

        const templates = new TemplateRepository();
        templates.initialize();

        const template = await templates.getTemplateByKey(data.template);

        console.log({
            subject: template.subject,
            html: template.html,
            ...data
        });

        // await sendEmail({
        //     subject: template.subject,
        //     html: template.html,
        //     ...data
        // });
    } catch (error) {
        console.log(error);
    }
};
