import { SNS } from 'aws-sdk';
import { config } from './config';

const sns = new SNS({
    endpoint: process.env.SNS_ENDPOINT
});

export const publish = async message =>
    sns
        .publish({
            Message: JSON.stringify(message),
            TopicArn: config.SNS_EVENTSARN
        })
        .promise();
