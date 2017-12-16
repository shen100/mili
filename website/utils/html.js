const htmlUtil = {
    trimImg (str) {
        str = str.replace(/<\s*img\s+.*?\/?\s*>/g, '')
        return str
    }
}

export default htmlUtil
