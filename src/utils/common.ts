import url from 'url';

export const strToPage = (pageStr: string) => {
    let page: number = parseInt(pageStr, 10);
    if (isNaN(page)) {
        page = 1;
    }
    return page;
};

export const urlBaseName = (urlStr: string) => {
    const pathname = url.parse(urlStr).pathname;
    const pathArr = pathname.split('/');
    return pathArr[pathArr.length - 1];
};
