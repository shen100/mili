<template>
    <div id="comments" class="comments">
        <CommentRichEditor :articleID="articleID" :sendDefVisible="false" />
        <div :style="{marginTop: interestingComments.length ? '0' : '24px'}" class="top-title">
            <span>全部评论（{{totalCount}}）</span> 
            <a @click="onAuthorOnly" class="author-only" :class="{active: isAuthorOnly}">只看作者</a> 
            <a class="close-btn" style="display: none;">关闭评论</a> 
            <div class="pull-right">
                <a @click="changeASC(true)" :class="{active: isASC}">按时间正序</a>
                <a @click="changeASC(false)" :class="{active: !isASC}">按时间倒序</a>
            </div>
        </div>
        <div v-for="(comment, i) in comments" class="comment" :class="{'no-border': i === comments.length - 1}"
            :key="`comment-${comment.id}`" :id="`comment-${comment.id}`" >
            <div>
                <div class="author">
                    <div class="v-tooltip-container" style="z-index: 0;">
                        <div class="v-tooltip-content">
                            <a :href="`/u/${comment.user.id}.html`" target="_blank" class="avatar"><img :src="comment.user.avatarURL"></a>
                        </div>
                    </div>
                    <div class="info">
                        <a :href="`/u/${comment.user.id}.html`" target="_blank" class="name">{{comment.user.username}}</a>
                        <span class="author-tag">作者</span>
                        <div class="meta"><span>{{i + 1}}楼 · 2019.02.26 00:37</span></div>
                    </div>
                </div>
                <div class="comment-wrap">
                    <p v-html="comment.htmlContent"></p>
                    <div class="tool-group">
                        <a :id="`like-button-${comment.id}`" class="like-button">
                            <span>{{comment.likeCount}}人赞</span>
                        </a>
                        <a @click="onCommentClick(comment)">
                            <i class="iconfont ic-comment"></i>
                            <span>回复</span>
                        </a>
                        <a class="report"><span>举报</span></a>
                    </div>
                </div>
            </div>
            <div v-if="subCommentsVisible(comment)" class="sub-comment-list">
                <div :key="`comment-${subcomment.id}`" v-for="subcomment in comment.comments" :id="`comment-${subcomment.id}`" class="sub-comment">
                    <div class="v-tooltip-box">
                        <div class="v-tooltip-container" style="z-index: 0;">
                            <div class="v-tooltip-content">
                                <a :href="`/u/${subcomment.user.id}.html`" target="_blank">{{subcomment.user.username}}</a>：
                            </div>
                        </div>
                        <span style="display: inline-block;">
                            <a v-if="subcomment.parentComment && subcomment.parentComment.id !== comment.id" :href="`/u/${subcomment.parentComment.user.id}.html`" class="maleskine-author" target="_blank">@{{subcomment.parentComment.user.username}}</a> 
                            <p v-html="subcomment.htmlContent"></p>
                        </span> 
                    </div>
                    <div class="sub-tool-group">
                        <span>2019.03.02 16:49</span>
                        <a @click="onAddSubComment(comment)"><i class="iconfont ic-comment"></i> <span>回复</span></a> 
                        <a class="report"><span>举报</span></a>
                    </div>
                </div>
                <div v-if="comment.comments.length" class="sub-comment more-comment">
                    <a @click="onAddSubComment(comment)" class="add-comment-btn">
                        <i class="iconfont ic-subcomment"></i> 
                        <span>添加新评论</span>
                    </a>
                    <!--
                    <span class="line-warp">
                        <a>收起</a>
                    </span> -->
                </div>
                <CommentRichEditor v-if="subCommentEditorVisible(comment)" :articleID="articleID" :sendDefVisible="true" />
            </div>
        </div>
        <a class="c-load-more">查看更多评论</a>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import CommentRichEditor from '~/js/components/editor/CommentRichEditor.vue';

export default {
    name: 'CommentsOfArticle',
    props: [
        'articleID',
        'authorID',
    ],
    data: function() {
        return {
            interestingComments: [],
            comments: [],
            totalCount: 0,
            isAuthorOnly: false,
            isASC: true
        };
    },
    mounted: function() {
        this.reqComments();
    },
    methods: {
        onAuthorOnly() {
            this.isAuthorOnly = !this.isAuthorOnly;
            this.reqComments();
        },
        changeASC(value) {
            const shouldLoad = isASC !== value;
            this.isASC = value;
            if (shouldLoad) {
                this.reqComments();
            }
        },
        reqComments() {
            let dateorder = 1;
            if (this.isASC) {
                dateorder = 0;
            }
            let authorID;
            if (this.isAuthorOnly) {
                authorID = this.authorID;
            }
            const url = `/comments/article/${this.articleID}?dateorder=${dateorder}&authorID=${authorID}`;
            myHTTP.get(url).then((res) => {
                const comments = res.data.data.comments || [];
                const commentMap = {};
                comments.forEach(comment => {
                    comment.toggled = false;
                    comment.comments = [];
                    commentMap[comment.id] = comment;
                });
                const subComments = res.data.data.subComments || [];
                subComments.forEach(subComment => {
                    commentMap[subComment.parentID].comments.push(subComment);
                    subComment.parentComment = commentMap[subComment.parentID];
                });
                this.comments = comments;
                this.totalCount = res.data.data.totalCount;
            });
        },
        subCommentsVisible(comment) {
            if (comment.comments.length) {
                return true;
            }
            if (comment.toggled) {
                return true;
            }
            return false;
        },
        subCommentEditorVisible(comment) {
            if (comment.comments.length <= 0 || comment.toggled) {
                return true;
            }
            return false;
        },
        onCommentClick(comment) {
            comment.toggled = !comment.toggled;
        },
        onAddSubComment(comment) {
            comment.toggled = !comment.toggled;
        }
    },
    components: {
        CommentRichEditor,
    }
};
</script>

<style>
.comments .comment {
    padding: 20px 0 30px;
    border-bottom: 1px solid #f0f0f0;
}

.comments .comment .author {
    margin-bottom: 15px;
}

.comments .comment .author-tag {
    margin-left: 2px;
    padding: 0 2px;
    font-size: 12px;
    color: #ea6f5a;
    border: 1px solid #ea6f5a;
    border-radius: 3px;
    vertical-align: middle;
}

.comments .comment p {
    font-size: 16px;
}

.comments .comment-wrap p {
    margin: 10px 0;
    line-height: 1.5;
    font-size: 16px;
    word-break: break-word!important;
    word-break: break-all;
}

.comments .comment .tool-group a {
    margin-right: 10px;
    font-size: 0;
    color: #969696;
    display: inline-block;
    vertical-align: top;
    line-height: normal;
}

.comments .comment .tool-group a:hover {
    text-decoration: none;
    color: #333;
}

.comments .comment .like-button {
    position: relative;
    padding-left: 23px;
}

.comments .comment .like-button:hover:before {
    background-position: -50px;
}

.comments .comment .like-button:before {
    content: '';
    position: absolute;
    left: -16px;
    top: -16px;
    width: 50px;
    height: 50px;
    background-image: url(../../../images/zan.png);
    background-position: left;
    background-repeat: no-repeat;
    background-size: 1050px 50px;
}

.comments .comment .tool-group a span {
    vertical-align: middle;
    font-size: 14px;
}

.comments .comment .tool-group a i {
    margin-right: 5px;
    font-size: 18px;
    vertical-align: middle;
}

.ic-comment:before {
    content: "\E639";
}

.comments .comment .report {
    float: right;
    margin: 0 0 0 10px;
    display: none;
}

.comments .comment .sub-comment-list {
    margin-top: 20px;
    padding: 5px 0 5px 20px;
    border-left: 2px solid #d9d9d9;
}

.comments .comment .sub-comment {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px dashed #f0f0f0;
}

.comments .comment .sub-comment-list .v-tooltip-box {
    word-break: break-word!important;
    word-break: break-all;
    margin: 0 0 5px;
    font-size: 14px;
    line-height: 1.5;
}

.v-tooltip-container {
    position: relative;
}

.v-tooltip-container, .v-tooltip-content {
    display: inline-block;
}

.v-tooltip-container .v-tooltip-content {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.comments .comment .sub-comment-list a, .comments .comment .sub-comment-list a:hover {
    color: #3194d0;
}

.comments .comment .sub-tool-group {
    font-size: 12px;
    color: #969696;
}

.comments .comment .sub-tool-group a {
    margin-left: 10px;
    color: #969696;
}

.comments .comment .sub-tool-group a:hover {
    color: #333;
    text-decoration: none;
}

.comments .comment .sub-tool-group a i {
    margin-right: 5px;
    font-size: 14px;
    vertical-align: middle;
}

.ic-comment:before {
    content: "\E639";
}

.comments .comment .sub-tool-group a span {
    vertical-align: middle;
}

.comments .comment .sub-comment .report, .comments .comment .sub-comment .subcomment-delete {
    float: right;
    margin: 1px 0 0 10px;
    display: none;
}

.comments .comment .sub-tool-group a span {
    vertical-align: middle;
}

.comments .comment .sub-comment {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px dashed #f0f0f0;
}

.comments .comment .more-comment {
    font-size: 14px;
    color: #969696;
    border: none;
}

.comments .comment .sub-comment:last-child {
    margin: 0;
    padding: 0;
    border: none;
}

.comments .comment .sub-comment-list .add-comment-btn {
    color: #969696;
}

.comments .comment .sub-comment-list .add-comment-btn:hover {
    color: #333;
    text-decoration: none;
}

.comments .comment .sub-comment-list .add-comment-btn i {
    margin-right: 5px;
}

.ic-subcomment:before {
    content: "\E698";
}

.comments .comment .line-warp {
    margin-left: 10px;
    padding-left: 10px;
    border-left: 1px solid #d9d9d9;
}

.no-border {
    border: none!important;
}

.comments .c-load-more {
    display: block;
    color: #3194d0;
    font-size: 14px;
    line-height: 32px;
    text-align: center;
    background-color: #f4f5f6;
    margin-top: 10px;
    cursor: pointer;
}

.comments .c-load-more:hover {
    text-decoration: none;
}

.comments .top-title {
    padding-bottom: 20px;
    font-size: 17px;
    font-weight: 700;
    border-bottom: 1px solid #f0f0f0;
}

.comments .top-title span {
    display: inline-block;
    line-height: 24px;
}

.comments .top-title .author-only {
    margin-left: 10px;
    padding: 4px 8px;
    font-size: 12px;
    color: #969696;
    border: 1px solid #e1e1e1;
    border-radius: 12px;
}

.comments .top-title .author-only.active {
    color: #fff;
    border: 1px solid #ea6f5a;
    background-color: #ea6f5a;
}

.comments .top-title .author-only:focus, .comments .top-title .author-only:hover {
    text-decoration: none;
}

.comments .top-title .close-btn {
    margin-left: 10px;
    font-size: 12px;
    color: #969696;
}

.pull-right {
    float: right!important;
}

.comments .pull-right a {
    margin-left: 10px;
    font-size: 12px;
    font-weight: 400;
    color: #969696;
    display: inline-block;
}

.comments .pull-right .active, .comments .pull-right a:hover {
    color: #2f2f2f;
    text-decoration: none;
}
</style>
