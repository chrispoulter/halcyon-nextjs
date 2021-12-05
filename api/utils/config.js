import 'dotenv/config';

export const config = {
    VERSION: process.env.VERSION || '1.0.0',
    STAGE: process.env.STAGE || 'local'
};
