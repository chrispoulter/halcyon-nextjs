import { SNS } from 'aws-sdk';
import { config } from './config';

const sns = new SNS({
    region: config.AWS_REGION,
    endpoint: config.AWS_SNS_ENDPOINT
});

const topicArn = `arn:aws:sns:${config.AWS_REGION}:${config.AWS_ACCOUNT_ID}:halcyon-${config.STAGE}-events`;

export const publish = async message =>
    sns
        .publish({
            TopicArn: topicArn,
            Message: JSON.stringify(message)
        })
        .promise();
