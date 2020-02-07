<template>
    <div class="book-chapter" :class="{'fold-pc': menuToggled}">
        <SuccessTip ref="successTip" :width="200" />
        <div class="book-summary">
            <div class="book-summary-inner">
                <div class="book-summary__header">
                    <a href="/" class="logo">
                        <img src="../../../images/logo.png">
                    </a>
                    <a :href="`/${isHandbook ? 'handbooks' : 'books'}`" class="label">{{isHandbook ? '小册' : '开源图书'}}</a>
                </div>
                <div class="book-directory bought">
                    <router-link :id="`chapterLink-${c.id}`" :key="c.id" v-for="(c, i) in traverseArr" 
                        :to="`/${isHandbook ? 'handbooks' : 'books'}/${book.id}/chapters/${c.id}`"
                        class="section section-link"
                        :class="{'route-active': c.id === chapterID}"
                        :style="{'padding-left': (c.depth * 20) + 'px'}">
                        <div v-if="stepVisible" class="step" :class="{'section-read': i <= chapterIndex, 'section-current': i === chapterIndex}">
                            <div class="step-btn">{{i + 1}}</div>
                        </div>
                        <div class="center">
                            <div class="title">{{c.title}}</div>
                        </div>
                    </router-link>
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
                        <a :href="`/${isHandbook ? 'handbooks' : 'books'}/${book.id}`">{{book.name}}</a>
                    </div>
                    <UserDropdown v-if="userID" :userID="userID" :avatarURL="avatarURL" menuAlign="right" />
                </div>
                <div class="book-body transition--next">
                    <div class="section-view book-section-content">
                        <router-view></router-view>
                    </div>
                </div>
                <div class="book-handle book-direction">
                    <router-link v-if="prevChapterURL" :to="prevChapterURL">
                        <div class="step-btn step-btn--prev">
                            <img src="../../../images/handbook/prev.svg">
                        </div>
                    </router-link>
                    <router-link v-if="nextChapterURL && !isFinalChapter" :to="nextChapterURL">
                        <div class="step-btn step-btn--next">
                            <img src="../../../images/handbook/next.svg">
                        </div>
                    </router-link>
                    <div v-if="starModalEnabled && isFinalChapter" @click="onStarModal" class="step-btn step-btn--next step-btn--finished">
                        <img src="../../../images/handbook/finished.svg">
                    </div>
                </div>
            </div>
        </div>
        <StarModal v-if="starModalEnabled" ref="starModal" @commit="onStarCommit" :user="user" :book="book" type="book" />
    </div>
</template>

<script>
import queryString from 'query-string';
import SuccessTip from '~/js/components/common/SuccessTip.vue';
import { myHTTP } from '~/js/common/net.js';
import { parseTree, getTreeNode, getPrevNode, getNextNode, tree2Array } from '~/js/utils/tree';
import UserDropdown from '~/js/components/common/UserDropdown.vue';
import StarModal from '~/js/components/handbook/StarModal.vue';

export default {
    data () {
        let chapters = window.chapters || [];
        let stepVisible = true;
        chapters.map(c => {
            if (c.parentID) {
                stepVisible = false;
            }
        });
        chapters.reverse();
        const root = parseTree(chapters, {
            titleKey: 'name',
            dataKeys: ['expand'],
            returnRoot: true,
        });
        const chapterID = window.chapterID;
        const traverseArr = tree2Array(root.children);
        let chapterIndex = 0;
        for (let i = 0; i < traverseArr.length; i++) {
            if (traverseArr[i].id === chapterID) {
                chapterIndex = i;
                break;
            }
        }
        return {
            stepVisible,
            traverseArr,
            chapterIndex,
            isHandbook: window.isHandbook,
            chapterID,
            chapterTree: root.children,
            book: window.book,
            prevChapter: getPrevNode(getTreeNode(chapterID, root.children), root.children),
            nextChapter: getNextNode(getTreeNode(chapterID, root.children), root.children),
            user: window.user,
            userID: window.user && window.user.id || undefined,
            username: window.user && window.user.username || '',
            avatarURL: window.user && window.user.avatarURL || '',
            menuToggled: false,
            starModalEnabled: !window.isCommitedStar,
        };
    },
    mounted() {
        this.$nextTick(() => {
            document.getElementById(`chapterLink-${this.chapterID}`).scrollIntoView();
            if (this.starModalEnabled && this.isFinalChapter) {
                const parsed = queryString.parse(location.search);
                console.log(parsed);
                if (parsed && parsed.star_modal_visible) {
                    this.onStarModal();
                }
            }
        });
        this.$router.afterEach((to, from) => {
            const chapterID = parseInt(to.params.chapterID);
            if (chapterID !== this.chapterID) {
                this.chapterID = chapterID;
                this.prevChapter = getPrevNode(getTreeNode(chapterID, this.chapterTree), this.chapterTree);
                this.nextChapter = getNextNode(getTreeNode(chapterID, this.chapterTree), this.chapterTree);
                let chapterIndex = 0;
                const traverseArr = this.traverseArr;
                for (let i = 0; i < traverseArr.length; i++) {
                    if (traverseArr[i].id === chapterID) {
                        this.chapterIndex = i;
                        break;
                    }
                }
                // this.$nextTick(() => {
                //     document.getElementById(`chapterLink-${chapterID}`).scrollIntoView();
                // });
            }
        });
    },
    computed: {
        isFinalChapter() {
            return !this.nextChapter;
        },
        prevChapterURL() {
            if (!this.prevChapter) {
                return '';
            }
            const path = this.isHandbook ? 'handbooks' : 'books';
            return `/${path}/${this.book.id}/chapters/${this.prevChapter.id}`;
        },
        nextChapterURL() {
            if (!this.nextChapter) {
                return '';
            }
            const path = this.isHandbook ? 'handbooks' : 'books';
            return `/${path}/${this.book.id}/chapters/${this.nextChapter.id}`;
        }
    },
    methods: {
        onMenuClick () {
            this.menuToggled = !this.menuToggled;
        },
        onStarModal() {
            this.$refs.starModal.show();
        },
        onStarCommit() {
            this.starModalEnabled = false;
            this.$refs.successTip.show('评价已提交，请等待审核');
        }
    },
    components: {
        StarModal,
        SuccessTip,
        UserDropdown,
    }
}
</script>
