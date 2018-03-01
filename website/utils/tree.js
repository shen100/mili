/**
 * 由一个结点数组来解析成树形结构
 * options:
 *   titleKey: 结点名称对应的key，即结点显示时的文本
 *   dataKeys: 自定义数剧的key组成的数组
 */
export const parseTree = (nodes, options) => {
    if (!nodes || nodes.length <= 0) {
        return null
    }
    options = options || { titleKey: 'title' }
    let copyList = nodes.slice()
    let root = {
        id: 0,
        title: '无',
        depth: 0,
        children: []
    }
    let stores = []
    stores.push(root)
    while (stores.length) {
        let tree = stores[0]
        for (let i = copyList.length - 1; i >= 0; i--) {
            copyList[i].parentID = copyList[i].parentID || 0
            if (copyList[i].parentID === tree.id) {
                let node = {
                    id: copyList[i].id,
                    title: copyList[i][options.titleKey],
                    depth: tree.depth + 1,
                    children: []
                }
                if (options.dataKeys) {
                    for (let j = 0; j < options.dataKeys.length; j++) {
                        let key = options.dataKeys[j]
                        node[key] = copyList[i][key]
                        console.log(copyList[i].id, key, copyList[i][key])
                    }
                }
                stores.push(node)
                tree.children.push(node)
                copyList.splice(i, 1)
            }
        }
        stores.splice(0, 1)
    }
    return root.children
}
