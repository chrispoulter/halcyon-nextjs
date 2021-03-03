import { SNS } from 'aws-sdk';
import { captureError } from './logger';
import { config } from './config';

const options =
    config.ENVIRONMENT === 'dev'
        ? {
              endpoint: 'http://127.0.0.1:4002'
          }
        : undefined;

const sns = new SNS(options);

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
