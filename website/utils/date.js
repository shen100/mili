var moment = require('moment');

export default {
    parse (dateStr) {
        var formatStr = 'YYYY-MM-DDTHH:mm:ssZ'
        if (dateStr.indexOf('.') >= 0) {
            formatStr = 'YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZ'
        }
        return moment(dateStr, formatStr)
    },
    format (moment) {
        return moment.format('YYYY-MM-DDTHH:mm:ssZ')
    }
}
