<template>
    <div class="book-chapter-box">
        <div>
            <div class="book-chapter-tree-box">
                <h1 class="book-name">{{book.name}}</h1>
                <div class="book-chapter-tree">
                    <Tree v-if="isMounted" :data="treeData" :render="renderContent"></Tree>
                </div>
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
                    buttonProps: {
                        type: 'ghost',
                        size: 'small'
                    },
                    treeData: [
                        {
                            title: '第一章',
                            expand: true
                            // render: (h, { root, node, data }) => {
                            //     return h('span', {
                            //         style: {
                            //             display: 'inline-block',
                            //             width: '100%'
                            //         }
                            //     }, [
                            //         h('span', [
                            //             h('Icon', {
                            //                 props: {
                            //                     type: 'ios-folder-outline'
                            //                 },
                            //                 style: {
                            //                     marginRight: '8px'
                            //                 }
                            //             }),
                            //             h('span', data.title)
                            //         ]),
                            //         h('span', {
                            //             style: {
                            //                 display: 'inline-block',
                            //                 float: 'right',
                            //                 marginRight: '32px'
                            //             }
                            //         }, [
                            //             h('Button', {
                            //                 props: Object.assign({}, this.buttonProps, {
                            //                     icon: 'ios-plus-empty',
                            //                     type: 'primary'
                            //                 }),
                            //                 style: {
                            //                     width: '52px'
                            //                 },
                            //                 on: {
                            //                     click: () => { this.append(data) }
                            //                 }
                            //             })
                            //         ])
                            //     ])
                            // }
                        },
                        {
                            title: '第二章',
                            expand: true
                        }
                    ]
                }
            })
        },
        mounted () {
            this.isMounted = true
        },
        methods: {
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
                                click: () => { this.append(data) }
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
                const children = data.children || []
                children.push({
                    title: 'appended node',
                    expand: true
                })
                this.$set(data, 'children', children)
            },
            remove (root, node, data) {
                const parentKey = root.find(el => el === node).parent
                const parent = root.find(el => el.nodeKey === parentKey).node
                const index = parent.children.indexOf(data)
                parent.children.splice(index, 1)
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
