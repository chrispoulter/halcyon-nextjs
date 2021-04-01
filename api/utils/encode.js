export const base64Encode = str => Buffer.from(str, 'utf8').toString('base64');

export const base64EncodeObj = obj => {
    if (!obj) {
        return undefined;
    }

    return Buffer.from(JSON.stringify(obj), 'utf8').toString('base64');
};

export const base64DecodeObj = str => {
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
