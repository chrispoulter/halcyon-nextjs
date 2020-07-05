const fetch = require('node-fetch').default;
const { URLSearchParams } = require('url');

module.exports.fetch = async config => {
    try {
        const response = await fetch(config.url, {
            ...config,
            body: new URLSearchParams(config.body)
        });

        return await response.json();
    } catch (error) {
        console.error(error);
        return undefined;
    }
};
