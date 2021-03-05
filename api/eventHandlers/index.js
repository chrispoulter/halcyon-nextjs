import { sendEmailHandler } from './sendEmailHandler';
import { captureError } from '../utils/logger';

const handlers = {
    SEND_EMAIL: sendEmailHandler
};

export const handler = async event => {
    try {
        const message = event.Records[0].Sns.Message;
        const { type, data } = JSON.parse(message);

        const eventHandler = handlers[type];
        if (!eventHandler) {
            throw new Error(`Unknown event type: ${type}`);
        }

        await eventHandler(data);
    } catch (error) {
        captureError(error);
    }
};
