module.exports.format = (str, obj) => {
    let result = str;

    for (const [key, replaceValue] of Object.entries(obj)) {
        result = result.replace(new RegExp(`{${key}}`, 'g'), replaceValue);
    }

    return result;
};

module.exports.base64Encode = str => Buffer.from(str).toString('base64');
