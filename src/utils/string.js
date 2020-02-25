module.exports.format = (str, obj) => {
    let result = str;

    for (const [key, replaceValue] of Object.entries(obj)) {
        result = result.replace(new RegExp(`{${key}}`, 'g'), replaceValue);
    }

    return result;
};

module.exports.base64Encode = str => Buffer.from(str).toString('base64');

module.exports.tryParseInt = (str, defaultValue) => {
    if (!str) {
        return defaultValue;
    }

    const value = parseInt(str, 10);
    if (value < 1) {
        return defaultValue;
    }

    return value;
};
