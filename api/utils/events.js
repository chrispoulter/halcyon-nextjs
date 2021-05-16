import { SNS } from 'aws-sdk';
import { config } from './config';

const sns = new SNS({
    region: config.REGION,
    endpoint: config.SNS_ENDPOINT
});

const topicArn = `arn:aws:sns:${config.REGION}:${config.ACCOUNTID}:halcyon-${config.STAGE}-events`;

export const publish = async message =>
    sns
        .publish({
            TopicArn: topicArn,
            Message: JSON.stringify(message)
        })
        .promise();
