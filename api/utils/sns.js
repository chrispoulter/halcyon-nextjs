import { SNS } from 'aws-sdk';
import { captureError } from './logger';
import { isDev } from './config';

const sns = new SNS({
    endpoint: isDev ? 'http://127.0.0.1:4002' : undefined
});

export const publish = async ({ topic, data }) => {
    console.log('publish', topic, data)

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
