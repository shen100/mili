<template>
    <div class="book-chapter-box">
        <div>
            <div class="book-chapter-tree-box">
                <h1 class="book-name">{{book.name}}</h1>
                <div class="book-chapter-tree">
                    <Tree v-if="isMounted" :data="treeData" :render="renderContent"></Tree>
                </div>
                <div class="book-chapter-create">
                    <Button size="large" v-if="isMounted" type="primary" @click="onCreateChapterClick">创建章节</Button>
                </div>
                <Modal
                    v-model="createChapterModalVisible"
                    title="创建章节"
                    @on-cancel="cancelCreateChapter">
                    <Input v-model="createChapterName"
                        placeholder="章节名称"
                        size="large"/>
                    <Row style="margin-top: 14px;" type="flex" justify="space-between">
                        <Button type="ghost" style="width:48%" @click="cancelCreateChapter">取消</Button>
                        <Button type="primary" style="width:48%" @click="onCreateChapter">确定</Button>
                    </Row>
                    <div slot="footer"></div>
                </Modal>
            </div>
            <div class="book-chapter-editor">
                <h2 class="curchapter-name">正在编辑: {{curChapter.name}}</h2>
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

    export default {
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
                let chapters = arr[1].data.chapters || []
                return {
                    isMounted: false,
                    user: context.user,
                    content: '',
                    book: book,
                    chapters: chapters,
                    curChapter: {name: 'Go语言编程'},
                    createChapterID: 0,
                    createChapterName: '',
                    createChapterModalVisible: false,
                    buttonProps: {
                        type: 'ghost',
                        size: 'small'
                    },
                    treeData: [
                        {
                            title: '第一章',
                            expand: true,
                            children: []
                        },
                        {
                            title: '第二章',
                            expand: true,
                            children: []
                        }
                    ]
                }
            })
        },
        mounted () {
            this.isMounted = true
        },
        methods: {
            onCreateChapterClick () {
                this.createChapterID = 0
                this.createChapterModalVisible = true
            },
            cancelCreateChapter () {
                this.createChapterModalVisible = false
                this.createChapterID = 0
                self.createChapterName = ''
            },
            getNode (chapterID) {
                let nodes = this.treeData.slice(0)
                while (nodes.length > 0) {
                    let node = nodes[0]
                    if (node.chapterID !== chapterID) {
                        let children = node.children
                        if (children && children.length > 0) {
                            nodes = nodes.concat(children)
                        }
                        nodes.shift(0)
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
                        bookID: this.book.id
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
                            chapterID: res.data.chapter.id,
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
                console.log(this)
                this.createChapterID = data.chapterID || 0
                this.createChapterModalVisible = true
            },
            remove (root, node, data) {
                console.log(node, data)
                const parentKey = root.find(el => el === node).parent
                if (parentKey) {
                    const parent = root.find(el => el.nodeKey === parentKey).node
                    const index = parent.children.indexOf(data)
                    parent.children.splice(index, 1)
                } else {
                    console.log(node)
                    for (let i = 0; i < this.treeData.length; i++) {
                        if (this.treeData[i] === node.node) {
                            this.treeData.splice(i, 1)
                            break
                        }
                    }
                }
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
