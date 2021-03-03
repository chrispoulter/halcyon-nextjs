import { SNS } from 'aws-sdk';
import { captureError } from './logger';
import { config } from './config';

// const sns = new SNS({
//     endpoint: 'http://127.0.0.1:4002',
//     region: 'eu-west-1'
// });

const sns = new SNS();

export const publish = async ({ topic, data }) => {
    console.log('config', config);
    try {
        await sns
            .publish({
                Message: JSON.stringify(data),
                TopicArn: topic
            })
            .promise();
    } catch (error) {
        console.log('publish', topic, data, error);
        captureError(error);
    }
};
