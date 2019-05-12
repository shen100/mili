<template>
    <div id="normal-comment-list" class="normal-comment-list">
        <SuccessTip ref="successTip" />
        <ErrorTip ref="errorTip" />
        <Alert ref="deleteCommentAlert" width="450" 
            @ok="onDeleteCommentOk" @cancel="onDeleteCommentCancel" />
        <div id="comments">
            <!-- 允许评论，并且用户没有登录 -->
            <form v-if="isCommentEnabled && !userID" class="new-comment" style="margin-top: 15px;">
                <a href="javascript:void(0);" class="avatar" style="cursor: default;"><img style="cursor: default;" src="../../../images/avatar_default.png"></a>
                <div class="sign-container">
                    <a href="/signin.html" class="btn btn-sign">登录</a>
                    <span>后发表评论</span>
                </div>
            </form>

            <div v-if="isUserCommentsLikesLoaded" class="comments">
                <!-- 不允许评论, 并且不是作者(没登录，或登录了，但不是作者) -->
                <div v-if="!isCommentEnabled && userID !== authorID">
                    <div class="top-title"><span>评论</span><span class="close-tip">已关闭评论</span></div>
                    <div class="close-comment"></div> 
                    <div class="text">想发表一点看法咩，<a href="/chats">与Ta私信交流</a>吧~</div>
                </div>

                <template v-if="isCommentEnabled">
                    <CommentRichEditor ref="commentRichEditor" v-if="userID" :articleID="articleID" 
                        emptyPlaceholder="写下你的评论" @success="addCommentSuccess"
                        @error="addCommentError" :sendDefVisible="false" />
                    <div :style="{marginTop: interestingComments.length ? '0' : '24px'}" class="top-title" :class="{'no-border-bottom': totalCount <= 0}">
                        <span>全部评论（{{totalCount}}）</span> 
                        <a v-if="totalCount" @click="onAuthorOnly" class="author-only" :class="{active: isAuthorOnly}">只看作者</a> 
                        <div class="pull-right">
                            <a v-if="userID === authorID" @click="closeComment">关闭评论</a>
                        </div>
                        <!-- 允许评论，且一条评论也没有 -->
                        <template v-if="!totalCount && totalCount !== undefined">
                            <div class="no-comment"></div>
                            <div class="text">
                                智慧如你，不想<a @click="onFirstComment">发表一点想法</a>咩~
                            </div>
                        </template>
                    </div>
                    <div v-for="(comment, i) in comments" class="comment" :class="{'no-border': i === comments.length - 1}"
                        :key="`comment-${comment.id}`" :id="`comment-${comment.id}`">
                        <div>
                            <div class="author">
                                <div class="v-tooltip-container" :style="{'z-index': comment.id === mouseenterCommentID ? '999' : '0'}" 
                                    @mouseenter="onMouseEnterUser(comment.id)"
                                    @mouseleave="onMouseLeaveUser()">
                                    <div class="v-tooltip-content">
                                        <a :href="`/users/${comment.user.id}.html`" target="_blank" class="avatar"><img :src="comment.user.avatarURL"></a>
                                        <UserBusinessCard v-if="comment.id === mouseenterCommentID"
                                            :userID="comment.user.id" :followerID="userID" :onChange="onFollowChange"/>
                                    </div>
                                </div>
                                <div class="info">
                                    <a :href="`/users/${comment.user.id}.html`" target="_blank" class="name">{{comment.user.username}}</a>
                                    <span v-if="comment.user.id === authorID" class="author-tag">作者</span>
                                    <div class="meta"><span>{{i + 1}}楼 · {{comment.createdAtLabel}}</span></div>
                                </div>
                            </div>
                            <div class="comment-wrap">
                                <div v-html="comment.htmlContent"></div>
                                <div class="tool-group">
                                    <a @click="onLikeOrNot(comment)" class="like-button" :class="{active: comment.userLiked, 'zan-animation': comment.userLiked}">
                                        <span>{{comment.likeCount || ''}}{{comment.likeCount ? '人' : ''}}赞</span>
                                    </a>
                                    <a @click="onAddComment(comment)">
                                        <i class="iconfont ic-comment"></i>
                                        <span>回复</span>
                                    </a>
                                    <a v-if="comment.user.id === userID" @click="showDeleteCommentAlert(comment)" class="report"><span>删除</span></a>
                                </div>
                            </div>
                            <CommentRichEditor v-if="userID && comment.editorToggled" :articleID="articleID" :emptyPlaceholder="`回复${comment.user.username}`"
                                :sendDefVisible="true" :rootID="comment.id" @success="addCommentSuccess"
                                @error="addCommentError" :parentID="comment.id" @cancel="onCancelComment(comment)" />
                        </div>
                        <div v-if="comment.comments && comment.comments.length" class="sub-comment-list">
                            <div :id="`comment-${subcomment.id}`" :key="`comment-${subcomment.id}`" v-for="subcomment in comment.comments" class="sub-comment">
                                <div class="v-tooltip-box">
                                    <div class="v-tooltip-container" :style="{'z-index': subcomment.id === mouseenterCommentID2 ? '999' : '0'}" 
                                        @mouseenter="onMouseEnterUser2(subcomment.id)"
                                        @mouseleave="onMouseLeaveUser2()">
                                        <div class="v-tooltip-content">
                                            <a class="comment-user-name" :href="`/users/${subcomment.user.id}.html`" target="_blank">{{subcomment.user.username}}{{subcomment.user.id === authorID ? '(作者)' : ''}}</a>：
                                            <UserBusinessCard v-if="subcomment.id === mouseenterCommentID2" 
                                                :userID="subcomment.user.id" :followerID="userID" :onChange="onFollowChange" />
                                        </div>
                                    </div>
                                    <span style="display: inline-block;">
                                        <a v-if="!subcomment.parentIsRoot" 
                                            :href="`/users/${subcomment.parentComment.user.id}.html`" 
                                            class="maleskine-author comment-user-name" target="_blank">@{{subcomment.parentComment.user.username}}{{subcomment.parentComment.user.id === authorID ? '(作者)' : ''}}</a> 
                                    </span>
                                    <div class="comment-content-box" v-html="subcomment.htmlContent"></div>
                                </div>
                                <div class="sub-tool-group">
                                    <span>{{subcomment.createdAtLabel}}</span>
                                    <a @click="onLikeOrNot(subcomment)" class="like-button" :class="{active: subcomment.userLiked, 'zan-animation': subcomment.userLiked}">
                                        <span>{{subcomment.likeCount || ''}}{{subcomment.likeCount ? '人' : ''}}赞</span>
                                    </a>
                                    <a @click="onAddComment(subcomment)"><i class="iconfont ic-comment"></i> <span>回复</span></a> 
                                    <a v-if="subcomment.user.id === userID" @click="showDeleteCommentAlert(subcomment)" class="report"><span>删除</span></a>
                                </div>
                                <CommentRichEditor v-if="userID && subcomment.editorToggled" :emptyPlaceholder="`回复${subcomment.user.username}`"
                                    :articleID="articleID" :sendDefVisible="true" :rootID="comment.id" @success="addCommentSuccess"
                                    @error="addCommentError" :parentID="subcomment.id" @cancel="onCancelComment(subcomment)" />
                            </div>
                            <!--
                            <div v-if="comment.comments.length" class="sub-comment more-comment">
                                <a @click="onAddComment(comment)" class="add-comment-btn">
                                    <i class="iconfont ic-subcomment"></i> 
                                    <span>添加新评论</span>
                                </a>
                            </div> -->
                        </div>
                    </div>
                    <!-- 允许评论，且评论还没有加载完 -->
                    <a v-if="isLoadDone === 'no'" @click="onLoadMore" class="c-load-more">{{isLoading ? '正在加载...' : '查看更多评论'}}</a>
                    <p v-else-if="isLoadDone === 'yes' && totalCount > 0" class="all-comment-load">没有更多评论了</p>
                </template>
                <div v-else-if="userID === authorID" class="open-block" :class="{'no-border-top': !isCommentEnabled}">
                    <a @click="openComment" class="open-btn">打开评论</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import CommentRichEditor from '~/js/components/editor/CommentRichEditor.vue';
import SuccessTip from '~/js/components/common/SuccessTip.vue';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import { ErrorCode } from '~/js/constants/error.js';
import Alert from '~/js/components/common/Alert.vue';
import UserBusinessCard from '~/js/components/user/UserBusinessCard.vue';

export default {
    name: 'CommentsOfArticle',
    props: [
        'articleID',
        'authorID',
        'userID',
        'username',
        'avatarURL',
        'commentEnabled',
        'onFollowChange'
    ],
    data: function() {
        return {
            interestingComments: [], // 精彩评论
            commentMap: {},
            comments: [],
            totalCount: 0,
            isAuthorOnly: false,
            isCommentEnabled: this.commentEnabled,
            isLoadDone: 'unknow',
            isLoading: false,
            page: 1,
            userCommentsLikesMap: {}, // 登录用户在这篇文章下的所有点过赞的评论
            isUserCommentsLikesLoaded: false,
            curWillDeleteComment: null,
            mouseenterCommentID: undefined,
            mouseenterCommentID2: undefined,
        };
    },
    mounted: function() {
        this.reqComments(1);
        this.onReqUserCommentsLikes();
    },
    methods: {
        onMouseEnterUser(commentID) {
            this.mouseenterCommentID = commentID;
        },
        onMouseLeaveUser() {
            this.mouseenterCommentID = undefined;
        },
        onMouseEnterUser2(commentID) {
            this.mouseenterCommentID2 = commentID;
        },
        onMouseLeaveUser2() {
            this.mouseenterCommentID2 = undefined;
        },
        onFirstComment() {
            if (!this.userID) {
                location.href = '/signin.html';
                return;
            }
            this.$refs.commentRichEditor.focus();
        },
        // 当前登录用户在这篇文章下的所有点过赞的评论
        onReqUserCommentsLikes() {
            if (!this.userID) {
                this.isUserCommentsLikesLoaded = true;
                return;
            }
            const url = `/comments/likes/${this.articleID}`;
            myHTTP.get(url).then((res) => {
                const userCommentsLikesMap = {};
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.isUserCommentsLikesLoaded = true;
                    const likes = res.data.data.likes;
                    likes.forEach(like => userCommentsLikesMap[like.commentID] = true);
                    this.userCommentsLikesMap = userCommentsLikesMap;
                    this.updateCommentsLiks();
                }
            });
        },
        updateCommentsLiks() {
            if (!this.userID) {
                return;
            }
            if (Object.keys(this.userCommentsLikesMap).length <= 0) {
                return;
            }
            if (this.comments.length <= 0) {
                return;
            }
            this.comments.forEach(comment => {
                if (this.userCommentsLikesMap[comment.id]) {
                    comment.userLiked = true;
                }
                comment.comments.forEach(subComment => {
                    if (this.userCommentsLikesMap[subComment.id]) {
                        subComment.userLiked = true;
                    }
                });
            });
        },
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
            let url = `/comments/${this.articleID}?page=${page}`;
            if (this.isAuthorOnly) {
                url += `&author=${this.authorID}`;
            }
            myHTTP.get(url).then((res) => {
                this.isLoading = false;
                if (shouldClear) {
                    this.comments = [];
                }
                const comments = res.data.data.comments || [];
                // key为评论的id，value为评论（所有的评论，包括子评论）
                const commentMap = {};
                comments.forEach(comment => {
                    comment.editorToggled = false;
                    comment.userLiked = false;
                    comment.comments = [];
                    commentMap[comment.id] = comment;
                });
                const subComments = res.data.data.subComments || [];
                subComments.forEach(comment => {
                    commentMap[comment.id] = comment;
                });
                subComments.forEach(subComment => {
                    subComment.editorToggled = false;
                    subComment.userLiked = false;
                    commentMap[subComment.rootID].comments.push(subComment);
                    subComment.parentComment = commentMap[subComment.parentID];
                    subComment.rootComment = commentMap[subComment.rootID];
                    if (subComment.parentID === subComment.rootID) {
                        subComment.parentIsRoot = true;
                    } else {
                        subComment.parentIsRoot = false;
                    }
                });
                this.commentMap = commentMap;
                this.comments = this.comments.concat(comments);
                this.totalCount = res.data.data.totalCount || 0;
                this.page =  res.data.data.page;
                const pageSize =  res.data.data.pageSize;
                if (this.page * pageSize >= this.totalCount) {
                    this.isLoadDone = 'yes';
                } else {
                    this.isLoadDone = 'no';
                }
                this.updateCommentsLiks();
            }).catch(err => {
                this.isLoading = false;
            });
        },
        onAddComment(comment) {
            let subComments;
            const editorToggled = comment.editorToggled;
            if (comment.rootComment) {
                comment.rootComment.editorToggled = false;
                subComments = comment.rootComment.comments;
            } else {
                subComments = comment.comments;
            }
            subComments.forEach(comment => comment.editorToggled = false);
            comment.editorToggled = !editorToggled;
        },
        addCommentSuccess(comment) {
            this.$refs.successTip.show('回复成功');
            comment.user = {
                id: this.userID,
                username: this.username,
                avatarURL: this.avatarURL,
            };
            comment.editorToggled = false;
            comment.userLiked = false;
            comment.likeCount = 0;
            comment.comments = [];
            this.commentMap[comment.id] = comment;
            if (comment.parentID) {
                comment.parentComment = this.commentMap[comment.parentID];
                comment.rootComment = this.commentMap[comment.rootID];
                comment.parentComment.editorToggled = false;
                if (comment.parentID === comment.rootID) {
                    comment.parentIsRoot = true;
                } else {
                    comment.parentIsRoot = false;
                }
            }
            if (comment.rootID) {
                this.commentMap[comment.rootID].comments.push(comment);
            } else {
                this.comments.push(comment);
            }
        },
        addCommentError(message) {
            this.$refs.errorTip.show(message);
        },
        onCancelComment(comment) {
            comment.editorToggled = false;
        },
        onLikeOrNot(comment) {
            let url = `/comments/${comment.id}/like`;
            if (!comment.userLiked) {
                myHTTP.post(url).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        comment.userLiked = true;
                        comment.likeCount++;
                    }
                });
            } else {
                myHTTP.delete(url).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        comment.userLiked = false;
                        comment.likeCount--;
                    }
                });
            }
        },
        openComment() {
            const url = `/articles/${this.articleID}/opencomment`;
            myHTTP.put(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.isCommentEnabled = true;
                } else if (res.data.errorCode === ErrorCode.Forbidden.CODE) {
                    this.$refs.errorTip.show(res.data.message);
                }
            });
        },
        closeComment() {
            const url = `/articles/${this.articleID}/closecomment`;
            myHTTP.put(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.isCommentEnabled = false;
                } else if (res.data.errorCode === ErrorCode.Forbidden.CODE) {
                    this.$refs.errorTip.show(res.data.message);
                }
            });  
        },
        showDeleteCommentAlert(comment) {
            this.curWillDeleteComment = comment;
            this.$refs.deleteCommentAlert.show('删除评论', '确定要删除评论么?');
        },
        onDeleteCommentOk() {
            if (!this.curWillDeleteComment) {
                return;
            }
            const url = `/comments/${this.curWillDeleteComment.id}`;
            myHTTP.delete(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.$refs.successTip.show('评论已删除');
                    const comment = this.commentMap[this.curWillDeleteComment.id];
                    this.curWillDeleteComment = null;
                    if (!comment.parentID) {
                        const index = this.comments.indexOf(comment);
                        this.comments.splice(index, 1);
                        return;
                    }
                    this.comments.forEach(c => {
                        const index = c.comments.indexOf(comment);
                        c.comments.splice(index, 1);
                    });
                } else if (res.data.errorCode === ErrorCode.Forbidden.CODE) {
                    this.$refs.errorTip.show(res.data.message);
                }
            });   
        },
        onDeleteCommentCancel() {

        }
    },
    components: {
        CommentRichEditor,
        SuccessTip,
        ErrorTip,
        Alert,
        UserBusinessCard,
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

.comments .comment-wrap img {
    max-width: 100%;
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

.comments .comment-wrap:hover .tool-group .report {
    display: block!important;
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

.like-button.active:before {
    background-position: right!important;
}

.like-button.zan-animation:before {
    -webkit-animation: likeBlast 0.6s 1 steps(19);
    animation: likeBlast 0.6s 1 steps(19);
    background-position: right;
}

@-webkit-keyframes likeBlast {
    0% {
        background-position: -50px;
    }
    100% {
        background-position: right;
    }
}

@keyframes likeBlast {
    0% {
        background-position: -50px;
    }
    100% {
        background-position: right;
    }
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
    display: none!important;
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
    font-size: 16px;
    line-height: 1.5;
}

.v-tooltip-container {
    position: relative;
    z-index: 1;
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
    font-size: 14px;
    color: #969696;
}

.comments .sub-comment:hover .sub-tool-group .report {
    display: block!important;
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
    font-size: 18px;
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
    color: #969696;
}

.normal-comment-list .comment-user-name, .normal-comment-list .comment-user-name:hover {
    color: #3194d0!important;
    text-decoration: none;
}

.comment-content-box {
    display: inline;
}

.comment-content-box img {
    max-width: 100%;
}

.comment-wrap pre, .comment-content-box pre {
    word-spacing: normal;
    word-wrap: normal;
    word-break: break-word!important;
    word-break: break-all;
    overflow: auto;
}

.comment-content-box div, .comment-content-box p {
    display: inline;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 16px!important;
}

.no-border-bottom {
    border-bottom: none!important;
}

.no-border-top {
    border-top: none!important;
}

.comments .avatar img {
    border: none;
}
</style>
