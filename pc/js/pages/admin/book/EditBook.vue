<template>
    <div class="edit-book-area" :style="{height: editAreaHeight + 'px'}">
        <div class="book-top-edit">
            <div class="book-name">{{book && book.name}}</div>
            <div class="edit-book-btn" @click="onEditBookClick">
                <Icon type="ios-create-outline" />
            </div>
            <div style="flex: 1;"></div>
            <div class="book-chapter-create">
                <Button size="large" type="primary" style="margin-right: 10px;" @click="onCreateChapterClick">添加章节</Button>
                <Button v-if="book" :type="book.status === BookStatus.BookUnpublish ? 'primary' : 'error'" @click="onPublishBookClick" size="large">{{publishBtnLabel}}</Button>
            </div>
        </div>
        <div class="chapter-area">
            <div class="book-chapter-tree-box">
                <Tree v-if="isMounted" :data="treeExcludeRoot" :render="renderContent" empty-text=""></Tree>
            </div>
            <div class="book-chapter-editor" :style="{'padding-top': contentType === ArticleContentType.HTML ? 0 : '10px'}">
                <div v-if="!curChapter" class="no-chapter">暂无章节</div>
                <template v-else>
                    <div v-if="contentType === ArticleContentType.HTML" class="rich-editor-body-box-wrap">
                        <RichEditor title="" content="" ref="richEditor" mode="admin" />
                    </div>
                    <div v-else class="md-editor-body-box-wrap">
                        <MarkdownEditor v-if="uploadPolicy" :noPaddingTop="true" ref="mdEditor" />
                    </div>
                    <div style="border-top: 1px solid #e8eaec;"></div>
                    <div class="curchapter-name-box">
                        <h2 class="curchapter-name">{{'正在编辑: ' + curChapter.title}}</h2>
                        <div style="flex: 1;"></div>
                        <div v-if="contentType === ArticleContentType.HTML" @click="onShowCrawModal" class="book-content-crawl-btn">抓取内容</div>
                        <Button v-if="book" @click="onSaveChapterContent" type="primary" size="large">保存</Button>
                    </div>
                </template>
            </div>
            <CreateOrUpdateBookModal @book-updated="onBookUpdated" :bookID="bookID" ref="editBookModal" />
            <CreateOrUpdateChapterModal ref="createOrUpdateChapterModal" :bookID="bookID"
                @chapter-created="onChapterCreated" @chapter-updated="onChapterUpdated" />
            <CrawlContent ref="crawlContent" @html-load="onHtmlCrawl" />
        </div>
    </div>
</template>

<script>
    import '~/styles/editor/editDraft.scss';
    import '~/styles/editor/md.editor.scss';
    import '~/styles/editor/rich.editor.scss';
    import { myHTTP } from '~/js/common/net';
    import { getWindowSize } from '~/js/utils/dom';
    import { BookStatus } from '~/js/constants/book.js';
    import { ArticleContentType } from '~/js/constants/article';
    import { ErrorCode } from '~/js/constants/error.js';
    import RichEditor from '~/js/components/editor/RichEditor.vue';
    import CreateOrUpdateBookModal from '~/js/components/admin/book/CreateOrUpdateBookModal.vue';
    import CreateOrUpdateChapterModal from '~/js/components/admin/book/CreateOrUpdateChapterModal.vue';
    import CrawlContent from '~/js/components/admin/book/CrawlContent.vue';
    import { parseTree, getTreeNode, tree2Array } from '~/js/utils/tree';
    import MarkdownEditor from '~/js/components/editor/MarkdownEditor.vue';

    const buttonProps = {
        size: 'small',
        shape: 'circle'
    };

    export default {
        data () {
            return {
                headerBoxHeight: 0,
                editAreaHeight: 0,
                contentType: ArticleContentType.Markdown,
                ArticleContentType,
                maxDepth: 4, // 图书目录最多的层级
                user: window.user, // 当前登录用户
                bookID: parseInt(this.$route.params.id),
                book: null,
                content: '', // 用来设置编辑器的内容
                curChapter: null, // 当前选中的章节
                isMounted: false,
                createOrUpdateChapterModalVisible: false,
                treeExcludeRoot: [], // 去掉根结点的树
                uploadPolicy: null,
                BookStatus,
            }
        },
        computed: {
            publishBtnLabel() {
                if (!this.book) {
                    return '';
                }
                return this.book.status === this.BookStatus.BookPublished ? '下架图书' : '发布图书';
            }
        },
        mounted() {
            this.isMounted = true;
            Promise.all([
                myHTTP.get(`/books/detail/${this.bookID}`),
                myHTTP.get(`/books/${this.bookID}/chapters`),
                this.reqPolicy(),
            ]).then((arr) => {
                let book = arr[0].data.data;
                let chapters = arr[1].data.data || [];
                for (let i = 0; i < chapters.length; i++) {
                    chapters[i].expand = true;
                }
                chapters.reverse();
                const root = parseTree(chapters, {
                    titleKey: 'name',
                    dataKeys: ['expand'],
                    returnRoot: true,
                });

                const treeExcludeRoot = root && root.children || [];
                let curChapter = null;
                if (treeExcludeRoot && treeExcludeRoot.length) {
                    curChapter = treeExcludeRoot[0];
                }
                this.book = book;
                this.curChapter = curChapter;
                this.contentType = book.contentType,
                this.treeExcludeRoot = treeExcludeRoot;

                this.getBookChapterContent();

            }).catch(err => {
                console.log(err);
            });

            this.headerBoxHeight = document.getElementsByClassName('header-box')[0].offsetHeight;
            window.addEventListener('resize', this.onWindowResize);
            this.onWindowResize();
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onWindowResize);
        },
        methods: {
            reqPolicy() {
                const url = `/common/oss/policy`;
                return myHTTP.get(url).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        this.uploadPolicy = res.data.data.uploadPolicy;
                        window.uploadPolicy = this.uploadPolicy;
                        return;
                    }
                });
            },
            onWindowResize() {
                const winHeight = getWindowSize().height;
                this.editAreaHeight = winHeight - this.headerBoxHeight - 20 - 20;
                if (this.contentType === ArticleContentType.HTML) {
                    this.setRichEditorContentHeight();
                }
            },
            setRichEditorContentHeight() {
                if (!this.$refs.richEditor) {
                    return;
                }
                document.getElementsByClassName('rich-editor-body-box-wrap')[0].offsetHeight;
                this.$refs.richEditor.setContentHeight(this.editAreaHeight - 60 - 46 - 16 - 16 - 42);
            },
            getBookChapterContent() {
                if (!this.book || !this.curChapter) {
                    return;
                }
                return myHTTP.get(`/books/chapters/${this.curChapter.id}/editorcontent?contentType=${this.contentType}`).then((res) => {
                    let chapter = res.data.data;
                    if (this.contentType === ArticleContentType.Markdown) {
                        this.setEditorContent(chapter.content);
                    } else {
                        this.setEditorContent(chapter.htmlContent);
                    }
                })
            },
            setEditorContent(content) {
                this.content = content;
                if (this.contentType === ArticleContentType.Markdown) {
                    this.$refs.mdEditor.setContent(content);
                } else if (this.contentType === ArticleContentType.HTML) {
                    setTimeout(() => {
                        this.setRichEditorContentHeight();
                        this.$refs.richEditor.setHTML(content);
                    }, 100);
                }
            },
            getNode (chapterID) {
                return getTreeNode(chapterID, this.treeExcludeRoot);
            },
            onCreateChapterClick (data) {
                this.$refs.createOrUpdateChapterModal.show({
                    title: '',
                    bookID: this.bookID,
                    parentID: data && data.id || undefined,
                });
            },
            onEditChapterClick(data) {
                this.$refs.createOrUpdateChapterModal.show({
                    id: data.id,
                    title: data.title,
                });
            },
            onChapterCreated(data) {
                let chapterData = {
                    title: data.title,
                    expand: true,
                    content: '',
                    id: data.id,
                    children: []
                }
                if (data.parentChapterID) {
                    let node = this.getNode(data.parentChapterID)
                    node.children.push(chapterData);
                } else {
                    this.treeExcludeRoot.push(chapterData)
                }
                this.selectChapter(data.id);
            },
            onChapterUpdated(data) {
                this.getNode(data.id).title = data.title;
            },
            renderContent (h, { root, node, data }) {
                let hasChildren = !!(node.children && node.children.length);
                return h('span', {
                    style: { display: 'inline-block', width: '100%' }
                }, [
                    h('span', {
                        style: { cursor: 'pointer' },
                        on: { click: this.selectChapter.bind(this, data.id) }
                    }, [
                        h('Icon', {
                            props: {
                                type: hasChildren ? 'ios-folder-outline' : 'ios-paper-outline'
                            },
                            style: { marginRight: '8px'}
                        }),
                        h('span', {
                            style: {
                                color: (this.curChapter && data.id === this.curChapter.id) ? '#348eed' : '#333'
                            }
                        }, data.title)
                    ]),
                    h('span', {
                        style: { display: 'inline-block', float: 'right', marginRight: '32px' }
                    }, [
                        h('Button', {
                            props: Object.assign({}, buttonProps, { icon: 'md-create' }),
                            style: { marginRight: '8px' },
                            on: { click: this.onEditChapterClick.bind(this, data) }
                        }),
                        h('Button', {
                            props: Object.assign({}, buttonProps, { icon: 'md-add' }),
                            style: { marginRight: '8px', display: data.depth >= this.maxDepth ? 'none' : 'inline-block' },
                            on: { click: this.onCreateChapterClick.bind(this, data) }
                        }),
                        h('Button', {
                            props: Object.assign({}, buttonProps, { icon: 'md-trash' }),
                            on: { click: this.remove.bind(this, root, node, data) }
                        })
                    ])
                ])
            },
            selectChapter (id) {
                let node = this.getNode(id)
                this.curChapter = node;
                if (this.contentType === ArticleContentType.Markdown) {
                    this.$refs.mdEditor.setContent('');
                } else if (this.contentType === ArticleContentType.HTML) {
                    
                }
                this.getBookChapterContent();
            },
            remove (root, node, data) {
                let delNode = this.getNode(data.id);
                if (delNode && delNode.children && delNode.children.length) {
                    return this.$Message.error('目录下的章节删除后，才能删除目录');
                }

                const self = this;
                this.$Modal.confirm({
                    title: '删除章节',
                    content: `确定要删除 ${data.title} ?`,
                    closable: true,
                    onOk () {
                        myHTTP.delete(`/admin/books/${self.bookID}/chapters/${data.id}`).then((res) => {
                            if (res.data.errorCode !== ErrorCode.SUCCESS.CODE) {
                                self.$Message.error(res.data.message);
                                return;
                            }
                            if (self.curChapter && self.curChapter.id === data.id) {
                                self.curChapter = self.treeExcludeRoot[0];
                            }
                            if (data.parentID) {
                                const parent = self.getNode(data.parentID);
                                const index = parent.children.findIndex(n => n.id === data.id);
                                parent.children.splice(index, 1);
                            } else {
                                for (let i = 0; i < self.treeExcludeRoot.length; i++) {
                                    if (self.treeExcludeRoot[i].id === data.id) {
                                        self.treeExcludeRoot.splice(i, 1);
                                        break;
                                    }
                                }
                            }
                        });
                    },
                    onCancel () {

                    }
                })
            },
            onEditBookClick() {
                this.$refs.editBookModal.show();
            },
            onBookUpdated(data) {
                this.book.name = data.name;
            },
            onPublishBookClick() {
                if (!this.treeExcludeRoot || this.treeExcludeRoot.length <= 0) {
                    return this.$Message.error('没有章节，发布失败');
                }
                const self = this;
                const tip = self.book.status === self.BookStatus.BookUnpublish ? '发布' : '下架';
                this.$Modal.confirm({
                    title: tip,
                    content: `确定要${tip}?`,
                    closable: true,
                    onOk () {
                        let url = `/admin/books/${self.bookID}/unpublish`;
                        if (self.book.status === self.BookStatus.BookUnpublish) {
                            url = `/admin/books/${self.bookID}/publish`;
                        }
                        myHTTP.put(url).then((res) => {
                            if (res.data.errorCode !== ErrorCode.SUCCESS.CODE) {
                                self.$Message.error(res.data.message);
                                return;
                            }
                            if (self.book.status === self.BookStatus.BookUnpublish) {
                                self.book.status = self.BookStatus.BookPublished;
                                return self.$Message.success('图书已发布');
                            } else {
                                self.book.status = self.BookStatus.BookUnpublish;
                                return self.$Message.success('图书已下架');
                            }
                        });
                    },
                    onCancel () {

                    }
                })
            },
            onSaveChapterContent() {
                let data;
                if (this.contentType === ArticleContentType.Markdown) {
                    data = { content: this.$refs.mdEditor.getContent() };
                } else {
                    data = { htmlContent: this.$refs.richEditor.getHTML() };
                }
                myHTTP.put(`/admin/books/chapters/${this.curChapter.id}`, data).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        return this.$Message.success('章节已保存');
                    }
                });
            },
            onShowCrawModal() {
                this.$refs.crawlContent.show();
            },
            onHtmlCrawl(html) {
                this.setEditorContent(html);
            }
        },
        components: {
            RichEditor,
            CreateOrUpdateBookModal,
            CreateOrUpdateChapterModal,
            CrawlContent,
            MarkdownEditor,
        },
    }
</script>

<style lang="scss" scoped>
@import '../../../../styles/admin/book/edit_book.scss';
</style>
