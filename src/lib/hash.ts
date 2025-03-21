import crypto from 'crypto';

export const generateHash = (str: string) =>
    crypto.createHash('sha512').update(str).digest('hex');

export const verifyHash = (str: string, hash: string) => {
    console.log(
        'str',
        str,
        crypto.createHash('sha512').update(str).digest('hex')
    );
    console.log('has', hash);
    console.log(
        'verifyHash',
        hash === crypto.createHash('sha512').update(str).digest('hex')
    );

    return hash === crypto.createHash('sha512').update(str).digest('hex');
};
