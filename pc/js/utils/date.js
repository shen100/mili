export const formatYMDHMS = (date, sep1, sep2) => {
    if (typeof date === 'string' || typeof date === 'number') {
        date = new Date(date);
    }
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let d = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    month = month < 10 ? '0' + month : month;
    d = d < 10 ? '0' + d : d;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    sep1 = sep1 || '-';
    sep2 = sep2 || ':';
    let str = `${year}${sep1}${month}${sep1}${d} ${h}${sep2}${m}${sep2}${s}`;
    return str;
};