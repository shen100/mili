<template>
    <div class="section-content">
        <div v-if="chapter" class="section-page book-section-view">
            <h1 id="article-content-h1">{{chapter.name}}</h1>
            <div class="mili-editor" v-html="chapter.htmlContent"></div>
            <div class="comment-scroll-to"></div>
            <div v-if="chapter">
                <div>
                    <div class="comment-title-sep">评论</div>
                    <div id="comment-list" class="comment-list">
                        <CommentList ref="commentList" :collectionID="chapter.book.id" source="bookchapter" :sourceID="chapter.id" 
                            :user="user" :authorID="chapter.user.id" :rootCommentCount="chapter.rootCommentCount" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import CommentList from '~/js/components/comment/CommentList.vue';

export default {
    data () {
        return {
            user: window.user,
            chapterID: window.chapterID, 
            chapter: null,
            isFirstRequest: true,
        };
    },
    beforeRouteUpdate (to, from, next) {
        // 在当前路由改变，但是该组件被复用时调用
        // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
        // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
        // 可以访问组件实例 `this`
        this.chapterID = to.params.chapterID;
        this.reqChapter();
        next();
    },
    mounted () {
        this.$nextTick(() => {
            this.reqChapter();
        });
    },
    methods: {
        reqChapter() {
            const url = `/books/chapters/${this.chapterID}`;
            myHTTP.get(url).then((result) => {
                if (result.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.chapter = result.data.data;
                    if (!this.isFirstRequest) {
                        this.$nextTick(() => {
                            this.$refs.commentList.reset();
                        });
                    }
                    this.isFirstRequest = false;
                }
            });
        }
    },
    components: {
        CommentList,
    }
}
</script>
