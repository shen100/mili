<template>
    <div class="book-box">
        <div class="book-header">
            <h1>{{book.name | entity2HTML}}</h1>
        </div>
        <div>
            <div class="book-tree-box">
                <Tree v-if="isMounted" :data="treeData" :render="renderContent" empty-text="暂无章节"></Tree>
            </div>
            <div class="book-content-box">
                <h2 class="book-chapter-name">{{chapter.name}}</h2>
                <div class="golang123-editor golang123-richtxt" v-html="chapter.htmlContent"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import request from '~/net/request'
    import htmlUtil from '~/utils/html'
    import { parseTree } from '~/utils/tree'

    export default {
        validate ({ params }) {
            var hasId = !!params.id
            return hasId
        },
        data () {
            return {
            }
        },
        asyncData (context) {
            let query = context.query || {}
            let bookID = context.params.id
            let chapterID = query.chapterID
            let treeData
            let book
            return Promise.all([
                request.getBook({
                    client: context.req,
                    params: {
                        id: bookID
                    }
                }),
                request.getBookChapters({
                    client: context.req,
                    params: {
                        id: bookID
                    }
                })
            ]).then(function (arr) {
                book = arr[0].data.book
                if (!book) {
                    context.error({ statusCode: 404, message: 'Page not found' })
                    return
                }
                let chapters = arr[1].data.chapters || []
                for (let i = 0; i < chapters.length; i++) {
                    chapters[i].expand = true
                }
                treeData = parseTree(chapters, {
                    titleKey: 'name',
                    dataKeys: ['expand']
                })
                chapterID = chapterID || treeData[0].id
                return request.getBookChapter({
                    client: context.req,
                    params: {
                        chapterID: chapterID
                    }
                })
            }).then((res) => {
                if (res.data.chapter.bookID !== book.id) {
                    return context.error({ statusCode: 404, message: 'Page not found' })
                }
                return {
                    isMounted: false,
                    book: book,
                    treeData: treeData,
                    chapter: res.data.chapter,
                    user: context.user
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        mounted () {
            this.isMounted = true
            window.hljs.initHighlightingOnLoad()
        },
        head () {
            return {
                title: htmlUtil.entity2HTML(this.book.name) + ' - ' + htmlUtil.entity2HTML(this.chapter.name),
                link: [
                    { rel: 'stylesheet', href: '/styles/editor/simplemde.min.css' },
                    { rel: 'stylesheet', href: '/styles/highlight/codestyle.css' } // Solarized Light
                ],
                script: [
                    { src: '/javascripts/highlight/highlight.min.js' }
                ]
            }
        },
        layout: 'nosidebar',
        filters: {
            entity2HTML: htmlUtil.entity2HTML
        },
        methods: {
            renderContent (h, { root, node, data }) {
                let hasChildren = !!(node.children && node.children.length)
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('a', {
                        attrs: {
                            href: `/book/${this.book.id}?chapterID=${data.id}`,
                            'class': 'book-tree-link'
                        },
                        style: {
                            cursor: 'pointer'
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
                                color: (this.chapter && data.id === this.chapter.id) ? '#348eed' : '#333'
                            }
                        }, data.title)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    })
                ])
            }
        }
    }
</script>

<style>
    @import '../../assets/styles/book/book.css'
</style>
