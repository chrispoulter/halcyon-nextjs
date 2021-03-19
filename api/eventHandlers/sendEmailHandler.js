import { dataSources } from '../dataSources';
import { sendEmail } from '../utils/email';
import { config } from '../utils/config';

export const sendEmailHandler = async data => {
    const { templates } = dataSources(config.ENVIRONMENT);

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
