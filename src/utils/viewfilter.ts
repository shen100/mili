import * as moment from 'moment';

export const formatTime = (time: Date | string | number, formatStr: string): string => {
    return moment(time).format(formatStr);
};

export const currentTime = (ignore: string, formatStr: string): string => {
    return moment(new Date()).format(formatStr);
};

export const recentTime = (time: Date | string | number, formatStr: string): string => {
    const t = moment(time);
    const now = moment(Date.now());
    let timeArr = [
        { time: 8, unit: 'days', label: '' },
        { time: 7, unit: 'days', label: '1周前' },
        { time: 6, unit: 'days', label: '6天前' },
        { time: 5, unit: 'days', label: '5天前' },
        { time: 4, unit: 'days', label: '4天前' },
        { time: 3, unit: 'days', label: '3天前' },
        { time: 2, unit: 'days', label: '2天前' },
        { time: 1, unit: 'days', label: '1天前' },
    ];
    for (let i = 23; i > 0; i--) {
        timeArr.push({ time: i, unit: 'hours', label: `${i}小时前` });
    }
    timeArr = timeArr.concat([
        { time: 30, unit: 'minutes', label: '30分钟前' },
        { time: 15, unit: 'minutes', label: '15分钟前' },
        { time: 5, unit: 'minutes', label: '5分钟前' },
        { time: 3, unit: 'minutes', label: '3分钟前' },
        { time: 1, unit: 'minutes', label: '1分钟前' },
    ]);
    for (const timeData of timeArr) {
        if (t.add(timeData.time as any, timeData.unit).isBefore(now)) {
            if (timeData.label) {
                return timeData.label;
            }
            return moment(time).format(formatStr);
        }
        t.subtract(timeData.time as any, timeData.unit);
    }
    return '刚刚';
};

export const defaultValue = (val: any, defaultVal: any): any => {
    if (!val) {
        return defaultVal;
    }
    return val;
};