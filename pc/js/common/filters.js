export const jobCompany = (user) => {
    let str = '';
    if (user.job) {
        str = str + user.job;
    }
    if (user.job && user.company) {
        str = str + ' @ ';
    }
    if (user.company) {
        str = str + user.company;
    }
    return str;
}

export const levelImgURL = (level) => {
    const imgURL = {
        '1': 'lv1.svg',
    }[level] || 'lv1.svg';
    return globalConfig.imgPath + '/user/level/' + imgURL;
};
