<template>
    <div id="normal-comment-list" class="normal-comment-list">
        <ErrorTip ref="errorTip" />
        <div>
            <!-- 允许评论，并且用户没有登录 -->
            <form v-if="commentEnabled && !userID" class="new-comment">
                <a href="javascript:void(0);" class="avatar" style="cursor: default;"><img style="cursor: default;" src="../../../images/avatar_default.png"></a>
                <div class="sign-container">
                    <a href="/signin.html" class="btn btn-sign">登录</a>
                    <span>后发表评论</span>
                </div>
            </form>
            <!-- 允许评论，并且用户已经登录 -->
            <div v-if="commentEnabled && userID">
                <div class="top-title"><span>评论</span> <a class="close-btn" style="display: none;">关闭评论</a></div>
                <div class="no-comment"></div>
                <div class="text">
                    智慧如你，不想<a href="/signin.html">发表一点想法</a>咩~
                </div>
            </div>
        
            <div id="comments" class="comments">
                <!-- 不允许评论 -->
                <div v-if="!commentEnabled && userID !== authorID">
                    <div class="top-title"><span>评论</span><span class="close-tip">已关闭评论</span></div> 
                    <div class="close-comment"></div> 
                    <div class="text">想发表一点看法咩，<a href="/notifications#/chats/new?mail_to=2275425">与Ta私信交流</a>吧~</div>
                </div>

                <template v-if="commentEnabled">
                    <CommentRichEditor v-if="userID" :articleID="articleID" :sendDefVisible="false" />
                    <div :style="{marginTop: interestingComments.length ? '0' : '24px'}" class="top-title">
                        <span>全部评论（{{totalCount}}）</span> 
                        <a v-if="totalCount" @click="onAuthorOnly" class="author-only" :class="{active: isAuthorOnly}">只看作者</a> 
                        <div class="pull-right">
                            <a v-if="userID === authorID" @click="closeComment">关闭评论</a>
                        </div>
                        <!-- 允许评论，且一条评论也没有 -->
                        <template v-if="!totalCount && totalCount !== undefined">
                            <div class="no-comment"></div>
                            <div class="text">
                                智慧如你，不想<a href="/signin.html">发表一点想法</a>咩~
                            </div>
                        </template>
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
                                    <span v-if="comment.user.id === authorID" class="author-tag">作者</span>
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
                                            <a class="comment-user-name" :href="`/u/${subcomment.user.id}.html`" target="_blank">{{subcomment.user.username}}{{subcomment.user.id === authorID ? '(作者)' : ''}}</a>：
                                        </div>
                                    </div>
                                    <span style="display: inline-block;">
                                        <a v-if="!subcomment.parentIsRoot" 
                                            :href="`/u/${subcomment.parentComment.user.id}.html`" 
                                            class="maleskine-author comment-user-name" target="_blank">@{{subcomment.parentComment.user.username}}{{subcomment.user.id === authorID ? '(作者)' : ''}}</a> 
                                    </span>
                                    <div class="comment-content-box" v-html="subcomment.htmlContent"></div>
                                </div>
                                <div class="sub-tool-group">
                                    <span>2019.03.02 16:49</span>
                                    <a @click="onAddSubComment(comment, subcomment)"><i class="iconfont ic-comment"></i> <span>回复</span></a> 
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
                            <CommentRichEditor :rootID="comment.id" :parentID="commentParentIDMap[comment.id]" v-if="subCommentEditorVisible(comment)" :articleID="articleID" :sendDefVisible="true" />
                        </div>
                    </div>
                    <!-- 允许评论，且评论还没有加载完 -->
                    <a v-if="isLoadDone === 'no'" @click="onLoadMore" class="c-load-more">{{isLoading ? '正在加载...' : '查看更多评论'}}</a>
                    <p v-else-if="isLoadDone === 'yes'" class="all-comment-load">没有更多评论了</p>
                </template>
                <div v-else-if="userID === authorID" class="open-block"><a @click="openComment" class="open-btn">打开评论</a></div>
            </div>
        </div>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import CommentRichEditor from '~/js/components/editor/CommentRichEditor.vue';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import { ErrorCode } from '~/js/constants/error.js';

export default {
    name: 'CommentsOfArticle',
    props: [
        'articleID',
        'authorID',
        'userID'
    ],
    data: function() {
        return {
            interestingComments: [],
            comments: [],
            totalCount: 0,
            isAuthorOnly: false,
            commentEnabled: window.commentEnabled,
            isLoadDone: 'unknow',
            isLoading: false,
            page: 1,
            commentParentIDMap: {} // 对评论进行评论时，key为一级评论的id，value为当前选中的二级评论
        };
    },
    mounted: function() {
        this.reqComments(1);
    },
    methods: {
        onAuthorOnly() {
            this.isAuthorOnly = !this.isAuthorOnly;
            this.reqComments(1, true);
        },
        onLoadMore() {
            this.reqComments(this.page + 1);
        },
        reqComments(page, shouldClear) {
            if (this.isLoading) {
                return;
            }
            this.isLoading = true;
            let authorID;
            if (this.isAuthorOnly) {
                authorID = this.authorID;
            }
            let url = `/comments/article/${this.articleID}?page=${page}`;
            if (authorID) {
                url += `&author=${authorID}`;
            }
            myHTTP.get(url).then((res) => {
                this.isLoading = false;
                if (shouldClear) {
                    this.comments = [];
                }
                const comments = res.data.data.comments || [];
                const commentMap = {};
                const commentParentIDMap = {};
                comments.forEach(comment => {
                    comment.toggled = false;
                    comment.comments = [];
                    commentMap[comment.id] = comment;
                    commentParentIDMap[comment.id] = comment.id;
                });
                const subComments = res.data.data.subComments || [];
                subComments.forEach(comment => {
                    commentMap[comment.id] = comment;
                });
                this.commentParentIDMap = commentParentIDMap;
                subComments.forEach(subComment => {
                    commentMap[subComment.rootID].comments.push(subComment);
                    subComment.parentComment = commentMap[subComment.parentID];
                    if (subComment.parentID === subComment.rootID) {
                        subComment.parentIsRoot = true;
                    } else {
                        subComment.parentIsRoot = false;
                    }
                });
                this.comments = this.comments.concat(comments);
                this.totalCount = res.data.data.totalCount || 0;
                this.page =  res.data.data.page;
                const pageSize =  res.data.data.pageSize;
                if (this.page * pageSize >= this.totalCount) {
                    this.isLoadDone = 'yes';
                } else {
                    this.isLoadDone = 'no';
                }
            }).catch(err => {
                this.isLoading = false;
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
        onAddSubComment(comment, subComment) {
            comment.toggled = !comment.toggled;
            if (subComment) {
                // 对二级评论进行评论
                this.commentParentIDMap[comment.id] = subComment.id;
            } else {
                // 对一级评论进行评论
                this.commentParentIDMap[comment.id] = comment.id;
            }
        },
        openComment() {
            const url = `/articles/${this.articleID}/opencomment`;
            console.log(ErrorCode);
            myHTTP.put(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.commentEnabled = true;
                } else if (res.data.errorCode === ErrorCode.Forbidden.CODE) {
                    this.$refs.errorTip.show(res.data.message);
                }
            });
        },
        closeComment() {
            const url = `/articles/${this.articleID}/closecomment`;
            myHTTP.put(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.commentEnabled = false;
                } else if (res.data.errorCode === ErrorCode.Forbidden.CODE) {
                    this.$refs.errorTip.show(res.data.message);
                }
            });  
        }
    },
    components: {
        CommentRichEditor,
        ErrorTip,
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

.comments .comment .sub-comment-list a {
    color: #969696;
}

.comments .comment .sub-comment-list a:hover {
    color: #2f2f2f;
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

.comments .open-block {
    padding: 30px 0 50px;
    text-align: center;
    border-top: 1px solid #f0f0f0;
}

.comments .open-block .open-btn {
    padding: 10px 20px;
    font-size: 16px;
    color: #969696;
    border: 1px solid #dcdcdc;
    border-radius: 20px;
}

.comments .open-block .open-btn:hover {
    text-decoration: none;
}

.comments .comment-list .normal-comment-list {
    margin-top: 30px;
}

.comments .comment-list .top-title {
    padding-bottom: 20px;
    font-size: 17px;
    font-weight: 700;
    border-bottom: 1px solid #f0f0f0;
}

.comments .comment-list .top-title span {
    vertical-align: middle;
}

.normal-comment-list .close-comment {
    background: url(../../../images/icon_comment_close.png) no-repeat;
    background-size: contain;
    width: 226px;
    height: 92px;
    margin: 30px auto 20px;
}

.normal-comment-list .close-comment, .normal-comment-list .no-author-comment, .normal-comment-list .no-comment {
    width: 226px;
    height: 92px;
    margin: 30px auto 20px;
}

.normal-comment-list .text {
    margin-bottom: 50px;
    text-align: center;
    font-size: 12px;
    color: #969696;
}

.normal-comment-list .text a, .normal-comment-list .text a:hover {
    color: #3194d0;
    text-decoration: none;
}

.normal-comment-list .top-title .close-tip {
    float: right;
    font-size: 12px;
    color: #969696;
}

.all-comment-load {
    text-align: center;
    border-top: 1px solid #f0f0f0;
    padding-top: 40px;
}

.normal-comment-list .comment-user-name, .normal-comment-list .comment-user-name:hover {
    color: #3194d0!important;
    text-decoration: none;
}

.comment-content-box {
    display: inline;
}

.comment-content-box div, .comment-content-box p {
    display: inline;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 14px!important;
}
</style>
