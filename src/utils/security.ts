import * as crypto from 'crypto';

export const md5 = (data: string, inputEncoding, encoding) => {
    if (!data) {
        return '';
    }
    inputEncoding = inputEncoding || 'utf-8';
    encoding = encoding || 'hex';
    const hash = crypto.createHash('md5');
    return hash.update(data, inputEncoding).digest(encoding);
};

export const sha1 = (data: string, inputEncoding, encoding) => {
    if (!data) {
        return '';
    }
    inputEncoding = inputEncoding || 'utf-8';
    encoding = encoding || 'hex';
    const hash = crypto.createHash('sha1');
    return hash.update(data, inputEncoding).digest(encoding);
};

export const hmacSHA1 = (key: string, data: string) => {
    // hmac.digest([encoding])
    // If encoding is provided a string is returned; otherwise a Buffer is returned;
    return crypto.createHmac('sha1', key).update(data).digest().toString('base64');
};

export const base64Encode = (str: string) => {
    const b = new Buffer(str);
    return b.toString('base64');
};

export const base64Decode = (str: string) => {
    const b = new Buffer(str, 'base64');
    return b.toString();
};