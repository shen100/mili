<template>
    <div id="app">
        <div class="code-info-box">
            <Row type="flex">
                <Col span="6" class="code-info-title">代码量</Col>
                <Col span="6" class="code-info-title">文件总数</Col>
                <Col span="6" class="code-info-title">已读文件数</Col>
                <Col span="6" class="code-info-title">未读文件数</Col>
            </Row>
            <Row type="flex">
                <Col span="6" class="code-info-label">{{codeTotalLine}}</Col>
                <Col span="6" class="code-info-label">{{fileTotalCount}}</Col>
                <Col span="6" class="code-info-label">{{fileReadedCount}}</Col>
                <Col span="6" class="code-info-label">{{fileRemainingCount}}</Col>
            </Row>
        </div>
        <div class="tree-box">
            <Tree v-if="isLoaded" :data="treeNodes" :render="renderContent"></Tree>
        </div>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import { parseTree } from '~/js/utils/tree.js';

export default {
    name: 'App',
    data: function() {
        const readed = [
            'pc/js/entry/codeStats.js',
            'pc/js/pages/CodeStats.vue',
            'src/stats/codestats.controller.ts',
            'views/pages/codeStats.njk',
            '.gitignore',
        ];
        const readedMap = {};
        readed.map(file => {
            readedMap[file] = true;
        });
        return {
            isLoaded: false,
            readedMap,
            files: [],
            treeNodes: [],
            codeTotalLine: '',
            fileTotalCount: '',
            fileReadedCount: readed.length,
            fileRemainingCount: '',
        };
    },
    mounted: function() {
        Promise.all([
            myHTTP.get('/codetree'),
            myHTTP.get('/codelinecount')
        ]).then((arr) => {
            const [res1, res2] = arr;
            const errorCode1 = res1.data.errorCode;
            const errorCode2 = res2.data.errorCode;

            if (!(errorCode1 === ErrorCode.SUCCESS.CODE && errorCode2 === ErrorCode.SUCCESS.CODE)) {
                return;
            }
            this.fileTotalCount = res1.data.data.fileCount;
            this.codeTotalLine = res2.data.data.count;
            this.fileRemainingCount = this.fileTotalCount - this.fileReadedCount;
            const codeLineMap = res2.data.data.codeLineMap;
            // 所有的文件，包含目录
            let files = res1.data.data.files;
            files.sort((a, b) => {
                if (a.isDirectory && !b.isDirectory) {
                    return 1;
                }
                if (b.isDirectory && !a.isDirectory) {
                    return -1;
                }
                return a.filename > b.filename ? -1 : 1;
            });
            files = files.map(file => {
                const index = file.filename.lastIndexOf('/');
                const title = index >= 0 ? file.filename.substr(index + 1) : file.filename;
                return {
                    id: file.filename,
                    parentID: index >= 0 ? file.filename.substr(0, index) : '',
                    title,
                    codeLineCount: codeLineMap[file.filename],
                    readed: !!this.readedMap[file.filename],
                    expand: true,
                }
            });
            this.files = files;
            this.createTree();
            this.isLoaded = true;
        });
    },
    methods: {
        createTree() {
            const treeNodes = parseTree(this.files, {
                dataKeys: ['expand', 'codeLineCount', 'readed'],
                withParentRef: true,
                rootID: '',
            });
            let list = treeNodes.slice(0);
            console.log(list);
            while (list.length) {
                const node = list[0];
                console.log(node);
                if (node.children && node.children.length) {
                    // 先把目录设为已读，然后再进行判断，只要目录下的文件，有一个文件（叶子结点）未读，那么再把目录设为未读
                    node.readed = true;
                    list = list.concat(node.children);
                } else if (!node.readed) {
                    // 叶子结点(文件)未读，那么所有的父结点都设为未读
                    let parent = node.parent;
                    while (parent) {
                        parent.readed = false;
                        parent = parent.parent;
                    }
                }
                list.splice(0, 1);
            }
            let list2 = treeNodes.slice(0);
            while (list2.length) {
                const node = list2[0];
                if (node.children && node.children.length) {
                    list2 = list2.concat(node.children);
                }
                delete node.parent;
                list2.splice(0, 1);
            }
            this.treeNodes = treeNodes;
        },
        renderContent: (h, { root, node, data }) => {
            const isDirectory = data.children && data.children.length;
            return h('span', {
                style: {
                    display: 'inline-block',
                    color: data.readed ? '#000' : 'rgb(237, 11, 11)'
                }
            }, [isDirectory ? data.title : `${data.title} (${data.codeLineCount}行)`]);
        },
    }
};
</script>
