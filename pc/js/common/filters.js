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
