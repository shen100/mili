export const strToPage = (pageStr: string) => {
    let page: number = parseInt(pageStr, 10);
    if (isNaN(page)) {
        page = 1;
    }
    return page;
};