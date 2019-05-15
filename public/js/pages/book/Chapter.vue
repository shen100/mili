<template>
    <div class="book-box">
        <div class="book-container">
            <div class="book-tree-box" :class="{'book-tree-box-fixed': chapterTreeFixed}" :style="{'height': chapterTreeHeight}">
                <div class="book-header">
                    <h1>{{book.name}}</h1>
                </div>
                <div class="book-tree-container">
                    <Tree :data="treeData" :render="renderContent" empty-text="暂无章节"></Tree>
                </div>
            </div>
            <div class="book-content-box" :class="{'book-content-box-expand': chapterTreeFixed}">
                <div style="height: 18px;"></div>
                <!-- ad -->
                <h2 class="book-chapter-name">{{chapter.name}}</h2>
                <div class="golang123-editor golang123-richtxt" v-html="chapter.htmlContent"></div>
                <div class="book-prev-next">
                    <div v-if="prevChapter" class="book-prev">上一篇: <a :href="`/book/${book.id}?chapterID=${prevChapter.id}`" :title="prevChapter.title">{{prevChapter.title}}</a></div>
                    <div v-if="nextChapter" class="book-next">下一篇: <a :href="`/book/${book.id}?chapterID=${nextChapter.id}`" :title="nextChapter.title">{{nextChapter.title}}</a></div>
                </div>
                <!-- ad -->
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
    asyncData (context) {
        let chapters = window.chapters || [];
        chapters.map(c => c.expand = true);
        const treeData = parseTree(chapters, {
            titleKey: 'name',
            dataKeys: ['expand']
        });

        return {
            isMounted: false,
            book: window.book,
            treeData,
            chapter,
            prevChapter: getPrevNode(getTreeNode(chapterID, treeData), treeData),
            nextChapter: getNextNode(getTreeNode(chapterID, treeData), treeData),
            user: window.user,
            chapterTreeFixed: false,
            chapterTreeHeight: '600px'
        };
    },
    mounted () {
        this.isMounted = true
        this.$nextTick(function () {
            window.addEventListener('scroll', this.onScroll)
            this.onScroll()
        })
    },
    filters: {
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
                        attrs: {
                            title: data.title
                        },
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
    }
}
</script>
