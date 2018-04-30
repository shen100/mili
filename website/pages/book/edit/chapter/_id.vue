<template>
    <div>
        <div class="create-book-step">
            <Steps v-if="stepVisible" :current="1">
                <Step title="基本信息" content="填写图书基本信息"></Step>
                <Step title="添加章节" content="添加图书章节"></Step>
                <Step title="发布图书" content="发布图书以便其他用户阅读"></Step>
            </Steps>
        </div>
        <div class="book-chapter-box">
            <div>
                <div class="book-chapter-tree-box">
                    <div class="book-name-edit-box">
                        <div v-if="!isEditBookName">
                            <h1 class="book-name">{{book.name}}</h1>
                            <ButtonGroup shape="circle" class="book-name-btngroup">
                                <Button @click="onEditBookNameClick" type="primary" icon="edit" size="small"></Button>
                                <Button @click="onPublishBookClick" type="primary" icon="android-upload" size="small"></Button>
                            </ButtonGroup>
                        </div>
                        <div v-else class="book-name-input-box">
                            <Input v-model="inputBookName" style="width: 180px;" :value="book.name" placeholder="请输入图书名称" size="small"></Input>
                            <Button @click="cancelEditBookNameClick" type="ghost" size="small" style="float:right;margin-right: 17px;">取消</Button>
                            <Button @click="onEditBookName" type="primary" size="small" style="float:right;margin-right: 10px;">确定</Button>
                        </div>
                    </div>
                    <div class="book-chapter-tree" :style="{padding: treeData.length ? '' : '12px 0 12px 20px'}">
                        <Tree v-if="isMounted" :data="treeData" :render="renderContent" empty-text="暂无章节"></Tree>
                    </div>
                    <div class="book-chapter-create">
                        <Button size="large" v-if="isMounted" type="primary" @click="onCreateChapterClick">添加章节</Button>
                    </div>
                    <Modal v-model="createChapterModalVisible"
                        :title="createChapterID ? '添加子章节' : '添加章节'"
                        @on-cancel="cancelCreateChapter">
                        <Input v-model="createChapterName" placeholder="章节名称" size="large"/>
                        <Row style="margin-top: 14px;" type="flex" justify="space-between">
                            <Button type="ghost" style="width:48%" @click="cancelCreateChapter">取消</Button>
                            <Button type="primary" style="width:48%" @click="onCreateChapter">确定</Button>
                        </Row>
                        <div slot="footer"></div>
                    </Modal>
                    <Modal v-model="editChapterNameModalVisible"
                        title="修改章节名称"
                        @on-cancel="cancelEditChapterName">
                        <Input v-model="tempChapterName" placeholder="章节名称" size="large"/>
                        <Row style="margin-top: 14px;" type="flex" justify="space-between">
                            <Button type="ghost" style="width:48%" @click="cancelEditChapterName">取消</Button>
                            <Button type="primary" style="width:48%" @click="onEditChapterName">确定</Button>
                        </Row>
                        <div slot="footer"></div>
                    </Modal>
                </div>
                <div class="book-chapter-editor">
                    <h2 class="curchapter-name">{{curChapter ? '正在编辑: ' + curChapter.title : '暂无章节'}}</h2>
                    <div v-if="contentType === 'html'" class="chapter-html-editor">
                        <html-editor :value="content" :user="user" @save="onContentSave" @change="onContentChange" />
                    </div>
                    <md-editor v-else="contentType === 'markdown'" ref="mdEditor" :value="content" :user="user" @save="onContentSave" @change="onContentChange"></md-editor>
                    <div>
                        <Button size="large" v-if="isMounted" type="primary" @click="onSaveChapterContent">保存</Button>
                        <span v-if="contentType === 'html'" @click="showCrawlModal" class="crawl-btn">抓取内容</span>
                    </div>
                </div>
                <Modal v-model="crawlModalVisible" title="抓取内容"
                        @on-cancel="cancelCrawl">
                    <div>
                        <Form ref="crawlerForm" :model="crawlerFormData" :rules="ruleCrawler" :label-width="120">
                            <FormItem label="内容选择器" prop="contentSelector">
                                <Row>
                                    <Col span="12">
                                        <Input v-model="crawlerFormData.contentSelector" placeholder="请输入内容选择器"></Input>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label="url" prop="url">
                                <Row>
                                    <Col span="12">
                                        <Input v-model="crawlerFormData.url" placeholder="请输入URL"></Input>
                                    </Col>
                                </Row>
                            </FormItem>
                        </Form>
                    </div>
                    <Row style="margin-top: 14px;" type="flex" justify="space-between">
                        <Button type="ghost" style="width:48%" @click="cancelCrawl">取消</Button>
                        <Button type="primary" style="width:48%" @click="onCrawl">确定</Button>
                    </Row>
                    <div slot="footer"></div>
                </Modal>
            </div>
        </div>
    </div>
</template>

<script>
    import request from '~/net/request'
    import HTMLEditor from '~/components/HTMLEditor'
    import Editor from '~/components/Editor'
    import ErrorCode from '~/constant/ErrorCode'
    import config from '~/config'
    import { parseTree, getTreeNode } from '~/utils/tree'

    export default {
        validate ({ params }) {
            var hasId = !!params.id
            return hasId
        },
        data () {
            return {
                crawlerFormData: {
                    contentSelector: '',
                    url: ''
                },
                ruleCrawler: {
                    contentSelector: [
                        { required: true, message: '内容选择器不能为空', trigger: 'blur' }
                    ],
                    url: [
                        { type: 'url', required: true, message: '无效的URL', trigger: 'blur' }
                    ]
                }
            }
        },
        asyncData (context) {
            return Promise.all([
                request.getBook({
                    client: context.req,
                    query: {
                        f: 'md'
                    },
                    params: {
                        id: context.params.id
                    }
                }),
                request.getBookChapters({
                    client: context.req,
                    params: {
                        id: context.params.id
                    }
                })
            ]).then((arr) => {
                let book = arr[0].data.book
                if (!book) {
                    context.error({ statusCode: 404, message: 'Page not found' })
                    return
                }
                if (book.userID !== context.user.id) {
                    context.error({ statusCode: 404, message: 'Page not found' })
                    return
                }
                let chapters = arr[1].data.chapters || []
                for (let i = 0; i < chapters.length; i++) {
                    chapters[i].expand = true
                }
                let treeData = parseTree(chapters, {
                    titleKey: 'name',
                    dataKeys: ['expand', 'content', 'htmlContent', 'contentType']
                })
                treeData = treeData || []
                let curChapter = null
                let content = ''
                let contentType = 'markdown'
                if (treeData && treeData.length) {
                    curChapter = treeData[0]
                }
                if (book.contentType === 1) {
                    contentType = 'markdown'
                    content = (curChapter && curChapter.content) || ''
                } else if (book.contentType === 2) {
                    content = (curChapter && curChapter.htmlContent) || ''
                    contentType = 'html'
                }
                return {
                    stepVisible: false,
                    contentType: contentType,
                    maxDepth: 4,
                    crawlModalVisible: false,
                    isEditBookName: false,
                    inputBookName: '',
                    editChapterNameModalVisible: false,
                    tempChapterID: 0, // 要修改名称的章节的id
                    tempChapterName: '', // 要修改名称的章节的名称
                    isMounted: false,
                    user: context.user,
                    book: book,
                    content: content, // 用来设置编辑器的内容
                    curChapter: curChapter, // 当前选中的章节
                    createChapterID: 0, // 创建章节时，用来记录父章节的id，若为0，表示无父章节
                    createChapterName: '',
                    createChapterModalVisible: false,
                    treeData: treeData,
                    buttonProps: {
                        type: 'ghost',
                        size: 'small'
                    }
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        mounted () {
            this.isMounted = true
            this.stepVisible = true
            this.getBookChapterContent()
        },
        methods: {
            getBookChapterContent () {
                let self = this
                if (!self.curChapter) {
                    return
                }
                request.getBookChapter({
                    query: {
                        f: self.contentType === 'markdown' ? 'md' : ''
                    },
                    params: {
                        chapterID: self.curChapter.id
                    }
                }).then((res) => {
                    let chapter = res.data.chapter
                    if (self.contentType === 'markdown') {
                        self.content = chapter.content
                    } else if (self.contentType === 'html') {
                        self.content = chapter.htmlContent
                    }
                })
            },
            showCrawlModal () {
                this.crawlModalVisible = true
            },
            cancelCrawl () {
                this.crawlModalVisible = false
            },
            onCrawl () {
                this.$refs['crawlerForm'].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    let reqData = {
                        url: this.crawlerFormData.url,
                        contentSelector: this.crawlerFormData.contentSelector
                    }
                    request.crawlNotSaveContent({
                        body: reqData
                    }).then((res) => {
                        if (res.errNo === ErrorCode.ERROR) {
                            this.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: res.msg
                            })
                            return
                        }
                        this.content = res.data.content || ''
                        this.crawlModalVisible = false
                    }).catch((err) => {
                        this.$Message.error({
                            duration: config.messageDuration,
                            closable: true,
                            content: err.msg
                        })
                    })
                })
            },
            onEditChapterName () {
                let self = this
                request.updateBookChapterName({
                    body: {
                        name: this.tempChapterName,
                        id: this.tempChapterID
                    }
                }).then(res => {
                    if (res.errNo === ErrorCode.ERROR) {
                        self.$Message.error({
                            duration: config.messageDuration,
                            closable: true,
                            content: res.msg
                        })
                    } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                        location.href = '/signin?ref=' + encodeURIComponent(location.href)
                    } else if (res.errNo === ErrorCode.SUCCESS) {
                        let node = self.getNode(self.tempChapterID)
                        node.title = self.tempChapterName
                        self.tempChapterID = 0
                        self.tempChapterName = ''
                        self.editChapterNameModalVisible = false
                        self.$Message.success({
                            duration: config.messageDuration,
                            closable: true,
                            content: '修改成功'
                        })
                    }
                }).catch(err => {
                    self.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: err.message || err.msg
                    })
                })
            },
            cancelEditChapterName () {
                this.tempChapterID = 0
                this.tempChapterName = ''
                this.editChapterNameModalVisible = false
            },
            onPublishBookClick () {
                if (!this.treeData || this.treeData.length <= 0) {
                    this.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: '没有章节，发布失败'
                    })
                    return
                }
                let self = this
                this.$Modal.confirm({
                    title: '发布图书',
                    content: '确定要发布图书?',
                    onOk () {
                        request.publishBook({
                            params: {
                                bookID: self.book.id
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.SUCCESS) {
                                self.$Message.success({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: '发布成功'
                                })
                            } else {
                                self.$Message.error({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: res.msg
                                })
                            }
                        }).catch(err => {
                            err = '内部错误'
                            self.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: err
                            })
                        })
                    },
                    onCancel () {

                    }
                })
            },
            onEditBookNameClick () {
                this.isEditBookName = true
                this.inputBookName = this.book.name
            },
            cancelEditBookNameClick () {
                this.isEditBookName = false
            },
            onEditBookName () {
                let self = this
                if (!this.inputBookName) {
                    this.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: '图书名称不能为空'
                    })
                    return
                }
                request.updateBookName({
                    body: {
                        id: this.book.id,
                        name: this.inputBookName
                    }
                }).then(res => {
                    if (res.errNo === ErrorCode.ERROR) {
                        self.$Message.error({
                            duration: config.messageDuration,
                            closable: true,
                            content: res.msg
                        })
                    } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                        location.href = '/signin?ref=' + encodeURIComponent(location.href)
                    } else if (res.errNo === ErrorCode.SUCCESS) {
                        self.$Message.success({
                            duration: config.messageDuration,
                            closable: true,
                            content: '修改成功'
                        })
                        self.book.name = res.data.book.name
                        self.isEditBookName = false
                    }
                }).catch(err => {
                    self.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: err.message || err.msg
                    })
                })
            },
            onCreateChapterClick () {
                this.createChapterID = 0
                this.createChapterModalVisible = true
                this.createChapterName = ''
            },
            cancelCreateChapter () {
                this.createChapterID = 0
                this.createChapterModalVisible = false
                this.createChapterName = ''
            },
            getNode (chapterID) {
                return getTreeNode(chapterID, this.treeData)
            },
            onCreateChapter () {
                let self = this
                let createChapterID = self.createChapterID
                request.createBookChapter({
                    body: {
                        name: this.createChapterName,
                        bookID: this.book.id,
                        parentID: createChapterID
                    }
                }).then(res => {
                    if (res.errNo === ErrorCode.ERROR) {
                        self.$Message.error({
                            duration: config.messageDuration,
                            closable: true,
                            content: res.msg
                        })
                    } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                        location.href = '/signin?ref=' + encodeURIComponent(location.href)
                    } else if (res.errNo === ErrorCode.SUCCESS) {
                        let chapterData = {
                            title: res.data.chapter.name,
                            expand: true,
                            content: '',
                            htmlContent: '',
                            id: res.data.chapter.id,
                            children: []
                        }
                        if (createChapterID) {
                            let node = self.getNode(createChapterID)
                            node.children.push(chapterData)
                        } else {
                            self.treeData.push(chapterData)
                        }
                        self.createChapterModalVisible = false
                        self.createChapterName = ''
                        self.createChapterID = 0
                        self.selectChapter({
                            id: res.data.chapter.id
                        })
                    }
                }).catch(err => {
                    self.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: err.message || err.msg
                    })
                })
            },
            onSaveChapterContent () {
                let self = this
                let reqData = {
                    chapterID: this.curChapter.id
                }
                if (this.contentType === 'html') {
                    reqData.htmlContent = this.content
                } else {
                    reqData.content = this.content
                }
                request.saveBookChapterContent({
                    body: reqData
                }).then(res => {
                    if (res.errNo === ErrorCode.ERROR) {
                        self.$Message.error({
                            duration: config.messageDuration,
                            closable: true,
                            content: res.msg
                        })
                    } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                        location.href = '/signin?ref=' + encodeURIComponent(location.href)
                    } else if (res.errNo === ErrorCode.SUCCESS) {
                        let node = self.getNode(self.curChapter.id)
                        if (self.contentType === 'html') {
                            node.htmlContent = self.content
                        } else {
                            node.content = self.content
                        }
                        self.$Message.success({
                            duration: config.messageDuration,
                            closable: true,
                            content: '保存成功'
                        })
                    }
                }).catch(err => {
                    self.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: err.message || err.msg
                    })
                })
            },
            onContentSave () {

            },
            onContentChange (content) {
                this.content = content
            },
            renderContent (h, { root, node, data }) {
                let hasChildren = !!(node.children && node.children.length)
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', {
                        style: {
                            cursor: 'pointer'
                        },
                        on: {
                            click: this.selectChapter.bind(this, data)
                        }
                    }, [
                        h('Icon', {
                            props: {
                                type: hasChildren ? 'ios-folder-outline' : 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', {
                            style: {
                                color: (this.curChapter && data.id === this.curChapter.id) ? '#348eed' : '#333'
                            }
                        }, data.title)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'edit'
                            }),
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: this.showEditChapterNameModal.bind(this, data)
                            }
                        }),
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'android-add'
                            }),
                            style: {
                                marginRight: '8px',
                                display: data.depth >= this.maxDepth ? 'none' : 'inline-block'
                            },
                            on: {
                                click: this.append.bind(this, data)
                            }
                        }),
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'android-remove'
                            }),
                            on: {
                                click: () => { this.remove(root, node, data) }
                            }
                        })
                    ])
                ])
            },
            selectChapter (data) {
                let node = this.getNode(data.id)
                this.curChapter = node
                this.getBookChapterContent()
            },
            showEditChapterNameModal (data) {
                this.tempChapterID = data.id
                this.tempChapterName = data.title
                this.editChapterNameModalVisible = true
            },
            append (data) {
                this.createChapterID = data.id || 0
                this.createChapterModalVisible = true
            },
            remove (root, node, data) {
                let self = this
                this.$Modal.confirm({
                    title: '删除章节',
                    content: '确定要删除这个章节?',
                    onOk () {
                        request.deleteBookChapter({
                            params: {
                                chapterID: data.id
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.SUCCESS) {
                                self.$Message.success({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: '已删除'
                                })
                                if (self.curChapter && self.curChapter.id === data.id) {
                                    self.curChapter = self.treeData[0]
                                }
                                const parentKey = root.find(el => el === node).parent
                                if (parentKey) {
                                    const parent = root.find(el => el.nodeKey === parentKey).node
                                    const index = parent.children.indexOf(data)
                                    parent.children.splice(index, 1)
                                } else {
                                    for (let i = 0; i < self.treeData.length; i++) {
                                        if (self.treeData[i] === node.node) {
                                            self.treeData.splice(i, 1)
                                            break
                                        }
                                    }
                                }
                            } else {
                                self.$Message.error({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: res.msg
                                })
                            }
                        }).catch(err => {
                            err = '内部错误'
                            self.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: err
                            })
                        })
                    },
                    onCancel () {

                    }
                })
            }
        },
        components: {
            'md-editor': Editor,
            'html-editor': HTMLEditor
        },
        head () {
            return {
                title: '编辑章节',
                link: [
                    { rel: 'stylesheet', href: '/styles/editor/simplemde.min.css' }
                ]
            }
        },
        layout: 'nosidebar',
        middleware: 'userRequired'
    }
</script>

<style>
    @import '../../../../assets/styles/book/edit_chapter.css'
</style>
