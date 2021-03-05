import { SNS } from 'aws-sdk';
import { captureError } from './logger';
import { config, settings } from './config';

const sns = new SNS(settings.sns);

export const publish = async message => {
    try {
        await sns
            .publish({
                Message: JSON.stringify(message),
                TopicArn: config.SNS_EVENTSARN
            })
            .promise();
    } catch (error) {
        captureError(error);
    }
};
