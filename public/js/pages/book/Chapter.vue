<template>
    <div class="book-chapter" :class="{'fold-pc': menuToggled}">
        <div class="book-summary">
            <div class="book-summary-inner">
                <div class="book-summary__header">
                    <a :href="`/${isHandbook ? 'handbooks' : 'books'}`" class="logo">
                        <img src="https://b-gold-cdn.xitu.io/v3/static/img/logo.a7995ad.svg">
                    </a>
                    <div class="label">{{isHandbook ? '小册' : '开源图书'}}</div>
                </div>
                <div class="book-directory bought">
                    <a :key="c.id" v-for="(c, i) in traverseArr" 
                        :href="`/${isHandbook ? 'handbooks' : 'books'}/${book.id}/chapters/${c.id}.html`"
                        class="section section-link"
                        :class="{'route-active': c.id === chapter.id}"
                        :style="{'padding-left': (c.depth * 20) + 'px'}">
                        <div v-if="isHandbook" class="step">
                            <div class="step-btn">{{i + 1}}</div>
                        </div>
                        <div class="center">
                            <div class="title">{{c.title}}</div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div class="book-content">
            <div class="book-content-inner">
                <div class="book-content__header">
                    <div @click="onMenuClick" class="menu">
                        <img src="../../../images/handbook/menu.svg">
                    </div>
                    <div class="title">
                        <a :href="`/${isHandbook ? 'handbooks' : 'books'}/${book.id}.html`">{{book.name}}</a>
                    </div>
                </div>
                <div class="book-body transition--next">
                    <div class="section-view book-section-content">
                        <div class="section-content">
                            <div class="section-page book-section-view">
                                <h1 id="article-content-h1">{{chapter.name}}</h1>
                                <div class="mili-editor" v-html="chapter.htmlContent"></div>
                                <div id="ad580x90_2" class="baidu-ad-580x90"></div>
                                <div>
                                    <CommentsOfArticle :articleID="chapter.id" :userID="userID" 
                                        :username="username" :avatarURL="avatarURL" 
                                        :authorID="authorID" :commentEnabled="true" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="book-handle book-direction">
                    <div v-if="prevChapter" @click="gotoPrevChapter" class="step-btn step-btn--prev">
                        <img src="../../../images/handbook/prev.svg">
                    </div>
                    <div v-if="nextChapter" @click="gotoNextChapter" class="step-btn step-btn--next">
                        <img src="../../../images/handbook/next.svg">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { parseTree, getTreeNode, getPrevNode, getNextNode } from '~/js/utils/tree';
import CommentsOfArticle from '~/js/components/comment/CommentsOfArticle.vue';

export default {
    data () {
        let chapters = window.chapters || [];
        chapters.map(c => c.expand = true);
        chapters.reverse();
        const root = parseTree(chapters, {
            titleKey: 'name',
            dataKeys: ['expand'],
            returnRoot: true,
        });
        const treeData = root.children;
        let tempArr = [ root ];
        let traverseArr = [];
        while (tempArr.length) {
            const node = tempArr.splice(0, 1)[0];
            traverseArr.push(node);
            if (node.children && node.children.length) {
                tempArr = node.children.concat(tempArr);
            }
        }
        traverseArr.splice(0, 1); // 去掉root
        const chapter = window.chapter;
        return {
            traverseArr,
            isHandbook: false,
            book: chapter.book,
            chapter,
            prevChapter: getPrevNode(getTreeNode(chapter.id, treeData), treeData),
            nextChapter: getNextNode(getTreeNode(chapter.id, treeData), treeData),
            user: window.user,
            userID: window.user && window.user.id || undefined,
            username: window.user && window.user.username || '',
            avatarURL: window.user && window.user.avatarURL || '',
            authorID: chapter.user.id,
            menuToggled: false,
            baiduAd: window.baiduAd,
        };
    },
    mounted () {
        this.$nextTick(() => {
            if (this.baiduAd && this.baiduAd.ad580x90_2) {
                window.BAIDU_CLB_fillSlotAsync(this.baiduAd.ad580x90_2, 'ad580x90_2')
            }
        })
    },
    filters: {
    },
    methods: {
        gotoPrevChapter () {
            const path = this.isHandbook ? 'handbooks' : 'books';
            location.href = `/${path}/${this.book.id}/chapters/${this.prevChapter.id}.html`;
        },
        gotoNextChapter () {
            const path = this.isHandbook ? 'handbooks' : 'books';
            location.href = `/${path}/${this.book.id}/chapters/${this.nextChapter.id}.html`;
        },
        onMenuClick () {
            this.menuToggled = !this.menuToggled;
        }
    },
    components: {
        CommentsOfArticle,
    }
}
</script>
