const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

module.exports.fetch = async config => {
    let result = undefined;

    try {
        const response = await fetch(config.url, {
            ...config,
            body: new URLSearchParams(config.body)
        });
        result = await response.json();
    } catch (error) {
        console.error('HTTP Request Failed', error);
    }

    return result;
};
