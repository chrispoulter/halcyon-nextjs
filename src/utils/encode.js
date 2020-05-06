module.exports.base64Encode = str =>
    Buffer.from(str, 'utf8').toString('base64');

module.exports.base64EncodeObj = obj =>
    Buffer.from(JSON.stringify(obj), 'utf8').toString('base64');

module.exports.base64DecodeObj = str => {
    if (!str) {
        return undefined;
    }

    try {
        return JSON.parse(Buffer.from(str, 'base64').toString('utf8'));
    } catch (error) {
        // ignore errors
        return undefined;
    }
};
