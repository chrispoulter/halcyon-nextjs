const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

module.exports.fetch = async request => {
    let result = undefined;

    try {
        const response = await fetch(request.url, {
            ...request,
            body: new URLSearchParams(request.body)
        });
        result = await response.json();
    } catch (error) {
        console.error('HTTP Request Failed', error);
    }

    return result;
};
