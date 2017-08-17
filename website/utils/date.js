var moment = require('moment')

const dateTool = {
    parse (dateStr) {
        var formatStr = 'YYYY-MM-DDTHH:mm:ssZ'
        if (dateStr.indexOf('.') >= 0) {
            formatStr = 'YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZ'
        }
        return moment(dateStr, formatStr)
    },
    format (moment) {
        return moment.format('YYYY-MM-DDTHH:mm:ssZ')
    },
    getReplyTime (date) {
        let time = dateTool.parse(date).valueOf()
        let currentT = new Date().getTime()
        let diff = (currentT - time) / 1000
        if (diff < 60) {
            return '刚刚'
        } else if (diff < 60 * 60) {
            return `${parseInt(diff / 60)}分钟前`
        } else if (diff < 24 * 60 * 60) {
            return `${parseInt(diff / 60 / 60)}小时前`
        } else if (diff < 365 * 24 * 60 * 60) {
            return `${parseInt(diff / 24 / 60 / 60)}天前`
        } else {
            return `${parseInt(diff / 365 / 24 / 60 / 60)}年前`
        }
    }
}

export default dateTool
