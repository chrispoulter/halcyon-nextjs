export const format = (str, obj) => {
    let result = str;

    for (const [key, replaceValue] of Object.entries(obj)) {
        result = result.replace(new RegExp(`{${key}}`, 'g'), replaceValue);
    }

    return result;
};
