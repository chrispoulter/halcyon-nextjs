import { SNS } from 'aws-sdk';
import { config } from './config';

const sns = new SNS({
    region: config.REGION,
    endpoint: config.STAGE === 'local' ? 'http://127.0.0.1:4002' : undefined
});

const topicArn = `arn:aws:sns:${config.REGION}:${config.ACCOUNTID}:halcyon-${config.STAGE}-events`;

export const publish = async message =>
    sns
        .publish({
            TopicArn: topicArn,
            Message: JSON.stringify(message)
        })
        .promise();
