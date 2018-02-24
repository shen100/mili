<template>
    <div class="book-chapter-box">
        <div>
            <div class="book-chapter-tree-box">
                <h1 class="book-name">{{book.name}}</h1>
                <div class="book-chapter-tree" :style="{padding: treeData.length ? '' : '12px 0 12px 20px'}">
                    <Tree v-if="isMounted" :data="treeData" :render="renderContent" empty-text="暂无章节"></Tree>
                </div>
                <div class="book-chapter-create">
                    <Button size="large" v-if="isMounted" type="primary" @click="onCreateChapterClick">创建章节</Button>
                </div>
                <Modal v-model="createChapterModalVisible"
                    :title="createChapterID ? '添加子章节' : '创建章节'"
                    @on-cancel="cancelCreateChapter">
                    <Input v-model="createChapterName" placeholder="章节名称" size="large"/>
                    <Row style="margin-top: 14px;" type="flex" justify="space-between">
                        <Button type="ghost" style="width:48%" @click="cancelCreateChapter">取消</Button>
                        <Button type="primary" style="width:48%" @click="onCreateChapter">确定</Button>
                    </Row>
                    <div slot="footer"></div>
                </Modal>
            </div>
            <div class="book-chapter-editor">
                <h2 class="curchapter-name">正在编辑{{curChapter ? curChapter.name : ''}}</h2>
                <md-editor :value="content" :user="user" @save="onContentSave" @change="onContentChange"></md-editor>
                <div>
                    <Button size="large" v-if="isMounted" type="primary" @click="onSubmit">保存</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import request from '~/net/request'
    import Editor from '~/components/Editor'
    import ErrorCode from '~/constant/ErrorCode'
    import config from '~/config'
    import { parseTree } from '~/utils/tree'

    export default {
        validate ({ params }) {
            var hasId = !!params.id
            return hasId
        },
        asyncData (context) {
            return Promise.all([
                request.getBook({
                    client: context.req,
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
                let chapters = arr[1].data.chapters || []
                for (let i = 0; i < chapters.length; i++) {
                    chapters[i].expand = true
                }
                let treeData = parseTree(chapters, {
                    titleKey: 'name',
                    dataKeys: ['expand']
                })
                console.log(treeData)
                let curChapter = null
                if (treeData && treeData.length) {
                    curChapter = treeData[0]
                }
                return {
                    isMounted: false,
                    user: context.user,
                    book: book,
                    content: '', // 用来设置编辑器的内容
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
            console.log(this.treeData)
        },
        methods: {
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
                let nodes = this.treeData.slice(0)
                while (nodes.length) {
                    let node = nodes[0]
                    if (node.id !== chapterID) {
                        let children = node.children
                        if (children && children.length > 0) {
                            nodes = nodes.concat(children)
                        }
                        nodes.shift()
                    } else {
                        return node
                    }
                }
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
                            id: res.data.chapter.id,
                            children: []
                        }
                        if (createChapterID) {
                            let node = self.getNode(createChapterID)
                            console.log('--------', node, createChapterID)
                            node.children.push(chapterData)
                        } else {
                            self.treeData.push(chapterData)
                        }
                        self.createChapterModalVisible = false
                        self.createChapterName = ''
                        self.createChapterID = 0
                    }
                }).catch(err => {
                    self.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: err.message || err.msg
                    })
                })
            },
            onSubmit () {

            },
            onContentSave () {

            },
            onContentChange () {

            },
            renderContent (h, { root, node, data }) {
                let hasChildren = !!(node.children && node.children.length)
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: hasChildren ? 'ios-folder-outline' : 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.title)
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
                                icon: 'ios-plus-empty'
                            }),
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: this.append.bind(this, data)
                            }
                        }),
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-minus-empty'
                            }),
                            on: {
                                click: () => { this.remove(root, node, data) }
                            }
                        })
                    ])
                ])
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
                            // err = '内部错误'
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
            'md-editor': Editor
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
