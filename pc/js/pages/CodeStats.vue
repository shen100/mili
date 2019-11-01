<template>
    <div id="app">
        <div class="op-box">
            <RadioGroup v-model="fileType" @on-change="onChange">
                <Radio label="all">
                    <span>全部</span>
                </Radio>
                <Radio label="readed">
                    <span>已读</span>
                </Radio>
                <Radio label="remaining">
                    <span>未读</span>
                </Radio>
            </RadioGroup>
        </div>
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
            'pc/js/common/default.js',
            'pc/js/common/filters.js',
            'pc/js/components/article/ArticleItem.vue',
            'pc/js/components/article/ArticleLoading.vue',
            'pc/js/components/article/ArticleSocial.vue',
            'pc/js/components/boilingpoint/BoilingPointItem.vue',
            'pc/js/components/boilingpoint/BoilingPointLoading.vue',
            'pc/js/components/boilingpoint/ReportAlert.vue',
            'pc/js/components/boilingpoint/Share.vue',
            'pc/js/components/book/BookLoading.vue',
            'pc/js/components/book/BookItem.vue',
            'pc/js/components/comment/ReplyIcon.vue',
            'pc/js/components/comment/ZanIcon.vue',
            'pc/js/components/common/More.vue',
            'pc/js/components/common/Paging.vue',
            'pc/js/components/handbook/HandBookComment.vue',
            'pc/js/components/handbook/StarModal.vue',
            'pc/js/components/handbook/UserList.vue',
            'pc/js/components/tag/TagInfo.vue',
            'pc/js/components/TopNavSearch.vue',
            'pc/js/components/user/FollowBtn.vue',
            'pc/js/entry/article/articleDetail.js',
            'pc/js/entry/boilingpoint/boilingpoint.js',
            'pc/js/entry/book/books.js',
            'pc/js/entry/book/bookDetail.js',
            'pc/js/entry/book/chapter.js',
            'pc/js/entry/codeStats.js',
            'pc/js/entry/index.js',
            'pc/js/entry/settings/settings.js',
            'pc/js/entry/tag/tag.js',
            'pc/js/entry/tag/tagDetail.js',
            'pc/js/entry/user/user.js',
            'pc/js/pages/boilingpoint/BoilingPoint.vue',
            'pc/js/pages/book/Books.vue',
            'pc/js/pages/book/BookDetail.vue',
            'pc/js/pages/book/Chapter.vue',
            'pc/js/pages/book/ChapterLayout.vue',
            'pc/js/pages/CodeStats.vue',
            'pc/js/pages/Index.vue',
            'pc/js/pages/settings/Layout.vue',
            'pc/js/pages/settings/PasswordView.vue',
            'pc/js/pages/settings/ProfileView.vue',
            'pc/js/pages/tag/Tag.vue',
            'pc/js/pages/tag/TagDetail.vue',
            'pc/js/pages/user/ArticleView.vue',
            'pc/js/pages/user/BoilingPointView.vue',
            'pc/js/pages/user/FollowTagView.vue',
            'pc/js/pages/user/FollowView.vue',
            'pc/js/pages/user/FollowerView.vue',
            'pc/js/pages/user/Layout.vue',
            'pc/js/pages/user/LikeArticleView.vue',
            'pc/js/pages/user/LikeBoilingPointView.vue',
            'pc/js/utils/event.js',
            'pc/js/utils/vue.js',
            'pc/styles/article/articleDetail.scss',
            'pc/styles/book/books.scss',
            'pc/styles/book/bookDetail.scss',
            'pc/styles/book/chapter.scss',
            'pc/styles/codeStats.scss',
            'pc/styles/settings/settings.scss',
            'pc/styles/tag/tagDetail.scss',
            'pc/styles/user/user.scss',
            'src/cms/dto/create-book-star.dto.ts',
            'src/cms/dto/create-comment.dto.ts',
            'src/cms/dto/create-tag.dto.ts',
            'src/cms/dto/update-tag.dto.ts',
            'src/cms/book.controller.ts',
            'src/cms/book.service.ts',
            'src/cms/tag.controller.ts',
            'src/cms/tag.service.ts',
            'src/cms/index.controller.ts',
            'src/entity/comment.entity.ts',
            'src/stats/codestats.controller.ts',
            'src/user/dto/update-avatar.dto.ts',
            'views/component/article/articles.njk',
            'views/component/book/bookList.njk',
            'views/component/user/recommendusers.njk',
            'views/layout/default.njk',
            'views/pages/article/articleDetail.njk',
            'views/pages/boilingpoint/boilingpoint.njk',
            'views/pages/books/books.njk',
            'views/pages/books/bookDetail.njk',
            'views/pages/books/chapter.njk',
            'views/pages/codeStats.njk',
            'views/pages/index.njk',
            'views/pages/settings/settings.njk',
            'views/pages/tag/tag.njk',
            'views/pages/tag/tagDetail.njk',
            '.gitignore',
            '.prettierrc',
            'nest-cli.json',
        ];
        const readedMap = {};
        readed.map(file => {
            readedMap[file] = true;
        });
        return {
            fileType: 'all',
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
                    isDirectory: file.isDirectory
                }
            });
            this.files = files;
            this.createTree();
            this.isLoaded = true;
        });
    },
    methods: {
        onChange() {
            this.createTree();
        },
        createTree() {
            const files = this.files.filter(file => {
                if (this.fileType === 'all') {
                    return true;
                }
                const readed = this.fileType === 'readed';
                // 当fileType不等于all时， 会保留多余的空目录
                return file.isDirectory || file.readed === readed;
            });
            console.log(files);
            const treeNodes = parseTree(files, {
                dataKeys: ['expand', 'codeLineCount', 'readed', 'isDirectory'],
                withParentRef: true,
                rootID: '',
            });
            let list = treeNodes.slice(0);
            while (list.length) {
                const node = list[0];
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
            if (this.fileType === 'readed' || this.fileType === 'remaining') {
                // 删除多余的空目录
                let list2 = treeNodes.slice(0);
                const arr = [];
                while (list2.length) {
                    const node = list2[0];
                    if (this.fileType === 'readed') {
                        node.readed = true;
                    } else if (this.fileType === 'remaining') {
                        node.readed = false;
                    }
                    if (node.children && node.children.length) {
                        list2 = list2.concat(node.children);
                    }
                    arr.push(list2[0]);
                    list2.splice(0, 1);
                }
                arr.reverse();
                // 从叶子结点往根遍历
                while (arr.length) {
                    const node = arr[0];
                    if (node.isDirectory && (!node.children || !node.children.length)) {
                        // 删除空目录
                        const index = node.parent.children.indexOf(node);
                        node.parent.children.splice(index, 1);
                    }
                    arr.splice(0, 1);
                }
            }
            let list3 = treeNodes.slice(0);
            while (list3.length) {
                const node = list3[0];
                if (node.children && node.children.length) {
                    list3 = list3.concat(node.children);
                }
                delete node.parent;
                list3.splice(0, 1);
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
