export const getShareURL = (data): string => {
    const title = encodeURIComponent(data.title || '');
    const imageURL = data.imageURL || '';
    return `/share?platform=${data.platform}&title=${title}&imgurl=${imageURL}`;
};