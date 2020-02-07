// 去掉首尾空格
export const trim = (str) => str.replace(/(^\s*)|(\s*$)/g, '')

// 提交数据去掉首尾空格
export const trimBlur = (str, self) => {
    let arr = str.split('.')
    let obj = self
    let end = arr.length - 1
    let objEnd = arr[end]
    arr.map((item, index) => {
        if (index !== end) {
            obj = obj[item]
        }
    })
    obj[objEnd] = trim(obj[objEnd])
}
