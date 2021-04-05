import { dataSources } from '../dataSources';
import { sendEmail } from '../utils/email';

export const sendEmailHandler = async data => {
    const { templates } = dataSources();

    const template = await templates.getByKey(data.template);
    if (!template) {
        throw new Error(`Unknown email template: ${data.template}`);
    }

    await sendEmail({
        subject: template.subject,
        html: template.html,
        to: data.to,
        context: data.context
    });
};
