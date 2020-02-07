const htmlUtil = {
    /*
     * 文章概要用到了这个方法，去掉图片
     */
    trimImg (str) {
        str = str.replace(/<\s*img\s+.*?\/?\s*>/g, '')
        return str
    },
    entity2HTML (str) {
        var arrEntities = {
            lt: '<',
            gt: '>',
            nbsp: ' ',
            amp: '&',
            quot: '"'
        }
        var reg = /&(lt|gt|nbsp|amp|quot);/ig
        return str.replace(reg, function (all, t) {
            return arrEntities[t]
        })
    }
}

export default htmlUtil
