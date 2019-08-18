<template>
    <div id="app">
        <div class="code-info-box">
            <Row type="flex">
                <Col span="12" class="code-info-title">代码量</Col>
                <Col span="12" class="code-info-title">文件总数</Col>
            </Row>
            <Row type="flex">
                <Col span="12" class="code-info-label">{{codeTotalLine}}</Col>
                <Col span="12" class="code-info-label">{{fileTotalCount}}</Col>
            </Row>
        </div>
        <div class="tree-box">
            <Tree v-if="isLoaded" :data="files" :render="renderContent"></Tree>
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
            '.gitignore'
        ];
        const readedMap = {};
        readed.map(file => {
            readedMap[file] = true;
        });
        console.log(readedMap);
        return {
            isLoaded: false,
            readedMap,
            files: [],
            codeTotalLine: '',
            fileTotalCount: '',
            fileReadedCount: '',
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
            this.codeTotalLine = res2.data.data.count;
            const codelineMap = res2.data.data.codelineMap;
            const files = res1.data.data.files.map(file => {
                const index = file.lastIndexOf('/');
                const title = index >= 0 ? file.substr(index + 1) : file;
                return {
                    id: file,
                    parentID: index >= 0 ? file.substr(0, index) : 0,
                    title,
                    codeLineCount: codelineMap[file],
                    readed: !!this.readedMap[file],
                    expand: true,
                }
            });
            this.fileTotalCount = files.length;
            this.files = parseTree(files, {
                dataKeys: ['expand', 'codeLineCount', 'readed']
            });
            this.isLoaded = true;
        });
    },
    methods: {
        renderContent: (h, { root, node, data }) => {
            if (data.readed) {
                console.log('=========>', data);
            }
            return h('span', {
                style: {
                    display: 'inline-block',
                    color: data.readed ? '#000' : 'rgb(237, 11, 11)'
                }
            }, [data.children && data.children.length ? data.title : `${data.title} (${data.codeLineCount}行)`]);
        },
    }
};
</script>
