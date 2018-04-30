<template>
    <div class="book-box">
        <div class="book-container">
            <div class="book-tree-box" :class="{'book-tree-box-fixed': chapterTreeFixed}" :style="{'height': chapterTreeHeight}">
                <div class="book-header">
                    <h1>{{book.name | entity2HTML}}</h1>
                </div>
                <div class="book-tree-container">
                    <Tree :data="treeData" :render="renderContent" empty-text="暂无章节"></Tree>
                </div>
            </div>
            <div class="book-content-box" :class="{'book-content-box-expand': chapterTreeFixed}">
                <div style="height: 18px;"></div>
                <baidu-bannerTwo760x90 />
                <h2 class="book-chapter-name">{{chapter.name}}</h2>
                <div class="golang123-editor golang123-richtxt" v-html="chapter.htmlContent"></div>
                <div class="book-prev-next">
                    <div v-if="prevChapter" class="book-prev">上一篇: <a :href="`/book/${book.id}?chapterID=${prevChapter.id}`">{{prevChapter.title}}</a></div>
                    <div v-if="nextChapter" class="book-next">下一篇: <a :href="`/book/${book.id}?chapterID=${nextChapter.id}`">{{nextChapter.title}}</a></div>
                </div>
                <baidu-bannerThree760x90 />
                <div style="height: 80px;"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import request from '~/net/request'
    import htmlUtil from '~/utils/html'
    import { parseTree, getTreeNode, getPrevNode, getNextNode } from '~/utils/tree'
    import { getPageHeight, getScrollTop } from '~/utils/dom'
    import baiduBannerTwo760x90 from '~/components/ad/baidu/banner2_760x90'
    import baiduBannerThree760x90 from '~/components/ad/baidu/banner3_760x90'

    export default {
        validate ({ params }) {
            var hasId = !!params.id
            return hasId
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
                if (!book || book.status === 'book_unpublish') {
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
                chapterID = parseInt(chapterID || treeData[0].id)
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
                    prevChapter: getPrevNode(getTreeNode(chapterID, treeData), treeData),
                    nextChapter: getNextNode(getTreeNode(chapterID, treeData), treeData),
                    user: context.user,
                    chapterTreeFixed: false,
                    chapterTreeHeight: '600px'
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        mounted () {
            this.isMounted = true
            window.hljs.initHighlightingOnLoad()

            this.$nextTick(function () {
                window.addEventListener('scroll', this.onScroll)
                this.onScroll()
            })
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
        layout: 'onlyheader',
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
            },
            onScroll () {
                let pageHeight = getPageHeight()
                let top = getScrollTop()
                let height = 60 + 20 // 导航 + 间隔 + 图书标题高度
                if (top > height) {
                    this.chapterTreeFixed = true
                    this.chapterTreeHeight = pageHeight + 'px'
                } else {
                    this.chapterTreeFixed = false
                    this.chapterTreeHeight = (pageHeight - height + top) + 'px'
                }
            }
        },
        components: {
            'baidu-bannerTwo760x90': baiduBannerTwo760x90,
            'baidu-bannerThree760x90': baiduBannerThree760x90
        }
    }
</script>

<style>
    @import '../../assets/styles/book/book.css'
</style>
