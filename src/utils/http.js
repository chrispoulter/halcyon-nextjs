const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const { captureException } = require('./logger');

module.exports.fetch = async config => {
    try {
        const response = await fetch(config.url, {
            ...config,
            body: new URLSearchParams(config.body)
        });

        return await response.json();
    } catch (error) {
        captureException(error);
        return undefined;
    }
};
