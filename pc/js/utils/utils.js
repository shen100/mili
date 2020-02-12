export const trim = (str) => {
    if (!str) {
        return '';
    }
    return str.replace(/^\s+|\s+$/g, '');
};

export const replaceIgnoreCase = (str, substr, replacement) => {
    if (!str) {
        return '';
    }
    return str.replace(substr, replacement);
};

export const ossResponseParse = (res, uploadImgURL) => {
    let xmlDOM = (new DOMParser()).parseFromString(res, 'text/xml');
    let PostResponseArr = xmlDOM.getElementsByTagName('PostResponse');
    if (PostResponseArr && PostResponseArr.length) {
        const PostResponse = PostResponseArr[0];
        const KeyArr = PostResponse.getElementsByTagName('Key');
        if (KeyArr && KeyArr[0]) {
            return {
                path: KeyArr[0].innerHTML,
                url: uploadImgURL + '/' + KeyArr[0].innerHTML
            };
        }
    }
    return {};
};

export const countToK = (count) => {
    if (!count) {
        return 0;
    }
    if (count < 1000) {
        return count;
    }
    let k = count / 100;
    k = (parseInt(k) + Math.ceil(k - parseInt(k))) / 10;
    return k;
};

export const readDuration = (wordCount) => {
    return parseInt((wordCount / 300 * 60), 10) + '分钟';
};

export const displayPrice = (price) => {
    return (price / 100).toFixed(2);
};
