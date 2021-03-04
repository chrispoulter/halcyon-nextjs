import { SNS } from 'aws-sdk';
import { captureError } from './logger';
import { settings } from './config';

const sns = new SNS(settings.sns);

export const publish = async ({ topic, data }) => {
    try {
        await sns
            .publish({
                Message: JSON.stringify(data),
                TopicArn: topic
            })
            .promise();
    } catch (error) {
        captureError(error);
    }
};
