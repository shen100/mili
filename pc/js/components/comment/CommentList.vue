<template>
    <div id="normal-comment-list" class="normal-comment-list">
        <SuccessTip ref="successTip" />
        <ErrorTip ref="errorTip" />
        <div id="comments">
            <form v-if="!userID" class="new-comment" style="margin-top: 15px;">
                <a href="javascript:void(0);" class="avatar" style="cursor: default;">
                    <img style="cursor: default;" src="../../../images/avatar_default.png">
                </a>
                <div class="sign-container">
                    <a :href="signinURL" class="btn btn-sign">登录</a>
                    <span>后发表评论</span>
                </div>
            </form>
            <div class="comments">
                <CommentRichEditor v-if="userID" ref="commentRichEditor" :bookID="bookID" :articleID="articleID" 
                    emptyPlaceholder="写下你的评论" @success="addCommentSuccess" @error="addCommentError" 
                    :sendDefVisible="false" :commentType="commentType" />
                <div v-for="comment in comments" class="comment lastchild-flag" 
                    :key="`comment-${comment.id}`" :id="`comment-${comment.id}`">
                    <div class="comment-avatar-area v-tooltip-container"
                        @mouseenter="onMouseEnterUser(comment.id, 'avatar')"
                        @mouseleave="onMouseLeaveUser">
                        <div class="v-tooltip-content">
                            <a :href="`/uc/${comment.user.id}`" target="_blank" class="avatar"><img :src="comment.user.avatarURL"></a>
                            <UserBusinessCard v-if="comment.id === mouseenterCommentID && mouseenterCommentTarget === 'avatar'"
                                :userID="comment.user.id" :followerID="userID" />
                        </div>
                    </div>
                    <div class="comment-content-area">
                        <div class="meta-box">
                            <div class="user-popover-box" @mouseenter="onMouseEnterUser(comment.id, 'username')"
                                    @mouseleave="onMouseLeaveUser">
                                <a :href="`/uc/${comment.user.id}`" target="_blank" class="username">
                                    {{comment.user.username}}
                                    <a :href="userLevelChapterURL" target="_blank" class="rank">
                                        <img :src="comment.user.level | levelImgURL">
                                    </a>
                                    <span v-if="comment.user.id === authorID" class="author-badge-text">(作者)</span>
                                </a>
                                <UserBusinessCard v-if="comment.id === mouseenterCommentID && mouseenterCommentTarget === 'username'"
                                    :userID="comment.user.id" :followerID="userID" />
                            </div>
                            <div class="position">{{comment.user | jobCompany}}</div>
                        </div>

                        <div class="comment-wrap" v-html="comment.htmlContent"></div>
                        <div class="comment-operate">
                            <div class="comment-time"><span>{{comment.createdAtLabel}}</span></div>
                            <div class="comment-action-box">
                                <div @click="onLikeOrNot(comment)" class="like-action">
                                    <ZanIcon :active="comment.userLiked" />
                                    <span class="action-title">{{comment.likedCount || ''}}</span>
                                </div>
                                <div class="comment-reply" @click="onAddComment(comment)">
                                    <ReplyIcon />
                                    <span class="action-title">回复</span>
                                </div>
                            </div>
                        </div>

                        <CommentRichEditor v-if="userID && comment.editorToggled" :bookID="bookID" :articleID="articleID" 
                            :emptyPlaceholder="`回复${comment.user.username}`"
                            :sendDefVisible="true" :rootID="comment.id" @success="addCommentSuccess"
                            @error="addCommentError" :parentID="comment.id" 
                            @cancel="onCancelComment(comment)"
                            :commentType="commentType" />
                        
                        <!-- 子评论 -->
                        <div v-if="comment.comments && comment.comments.length" class="sub-comment-list">
                            <div :id="`comment-${subcomment.id}`" :key="`comment-${subcomment.id}`" 
                                v-for="(subcomment, i) in comment.comments" class="sub-comment" :style="{'padding-top': i === 0 ? '14px' : '12px'}">
                                <div class="v-tooltip-container"
                                    @mouseenter="onMouseEnterUser(subcomment.id, 'avatar')"
                                    @mouseleave="onMouseLeaveUser">
                                    <div class="v-tooltip-content">
                                        <a :href="`/uc/${subcomment.user.id}`" target="_blank" class="avatar"><img :src="subcomment.user.avatarURL"></a>
                                        <UserBusinessCard v-if="subcomment.id === mouseenterCommentID && mouseenterCommentTarget === 'avatar'"
                                            :userID="subcomment.user.id" :followerID="userID" />
                                    </div>
                                </div>
                                <div class="subcomment-content-area">
                                    <div class="meta-box">
                                        <div class="user-popover-box" @mouseenter="onMouseEnterUser(subcomment.id, 'username')"
                                                @mouseleave="onMouseLeaveUser">
                                            <a :href="`/uc/${subcomment.user.id}`" target="_blank" class="username">
                                                {{subcomment.user.username}}
                                                <a :href="userLevelChapterURL" target="_blank" class="rank">
                                                    <img :src="subcomment.user.level | levelImgURL">
                                                </a>
                                                <span v-if="subcomment.user.id === authorID" class="author-badge-text">(作者)</span>
                                            </a>
                                            <UserBusinessCard v-if="subcomment.id === mouseenterCommentID && mouseenterCommentTarget === 'username'"
                                                :userID="subcomment.user.id" :followerID="userID" />
                                        </div>
                                        <div class="position">{{subcomment.user | jobCompany}}</div>
                                    </div>

                                    <div class="sub-content-box">
                                        <span> 回复 </span>
                                        <div class="user-popover-box">
                                            <a href="/" target="_blank" class="username be-replied">{{subcomment.user.username}}
                                                <a :href="`/uc/${subcomment.user.id}`" target="_blank" class="rank">
                                                    <img :src="subcomment.user.level | levelImgURL">
                                                </a>
                                            </a>
                                        </div>
                                        <span>: </span>
                                        <div class="sub-comment-wrap" v-html="subcomment.htmlContent"></div>
                                    </div>

                                    <div class="comment-operate" style="margin-bottom: 0;">
                                        <div class="comment-time"><span>{{subcomment.createdAtLabel}}</span></div>
                                        <div class="comment-action-box">
                                            <div @click="onLikeOrNot(subcomment)" class="like-action">
                                                <ZanIcon :active="subcomment.userLiked" />
                                                <span class="action-title">{{subcomment.likedCount || ''}}</span>
                                            </div>
                                            <div class="comment-reply" @click="onAddComment(subcomment)">
                                                <ReplyIcon />
                                                <span class="action-title">回复</span>
                                            </div>
                                        </div>
                                    </div>

                                    <CommentRichEditor v-if="userID && subcomment.editorToggled" :emptyPlaceholder="`回复${subcomment.user.username}`"
                                        :bookID="bookID" :articleID="articleID" :sendDefVisible="true" :rootID="comment.id" 
                                        :parentID="subcomment.id" @success="addCommentSuccess" @error="addCommentError"
                                        @cancel="onCancelComment(subcomment)" 
                                        :commentType="commentType" />
                                </div>
                            </div>
                            <div v-if="comment.comments.length < comment.commentCount" @click="onLoadSub(comment)" class="sub-comment fetch-more">
                                <div class="fetch-more-comment">{{subCommentLoadStatusMap[comment.id] ? '正在加载...' : '查看更多 >'}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="comments.length < rootCommentCount" @click="onLoadMore" 
                class="fetch-more-comment">{{isLoading ? '正在加载...' : '查看更多 >'}}</div>
            <div v-else style="height: 24px;"></div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { trim } from '~/js/utils/utils.js';
import { myHTTP } from '~/js/common/net.js';
import CommentRichEditor from '~/js/components/editor/CommentRichEditor.vue';
import SuccessTip from '~/js/components/common/SuccessTip.vue';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import { ErrorCode } from '~/js/constants/error.js';
import UserBusinessCard from '~/js/components/user/UserBusinessCard.vue';
import ZanIcon from '~/js/components/comment/ZanIcon.vue';
import ReplyIcon from '~/js/components/comment/ReplyIcon.vue';
import { jobCompany, levelImgURL } from '~/js/common/filters.js';

export default {
    name: 'CommentList',
    props: [
        'commentType',
        'rootCommentCount', // 一级评论数
        'bookID',
        'articleID',
        'authorID',
        'userID',
        'username',
        'avatarURL',
    ],
    data: function() {
        return {
            signinURL: '/signin?ref=' + encodeURIComponent(location.href),
            commentMap: {},
            subCommentLoadStatusMap: {}, // key 是父评论id, value 是 是否正在加载子评论
            comments: [],
            totalCount: 0,
            isLoading: false,
            page: 1,
            userCommentsLikesMap: {}, // 登录用户在这篇文章下的所有点过赞的评论
            isUserCommentsLikesLoaded: false,
            curWillDeleteComment: null,
            mouseenterCommentID: undefined,
            mouseenterCommentTarget: '',
            mouseenterCommentID2: undefined,
            isFirstRequest: true, // 请求评论列表，发出的第一个请求
            userLevelChapterURL: window.userLevelChapterURL,
        };
    },
    mounted: function() {
        this.reqComments(1);
        this.onReqUserCommentsLikes();
    },
    methods: {
        onMouseEnterUser(commentID, mouseenterCommentTarget) {
            this.mouseenterCommentID = commentID;
            this.mouseenterCommentTarget = mouseenterCommentTarget;
        },
        onMouseLeaveUser() {
            this.mouseenterCommentID = undefined;
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
            const url = `/comments/likes/${this.articleID}?commentType=${this.commentType}`;
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
        onLoadMore() {
            if (this.isLoading) {
                return;
            }
            this.reqComments(this.page + 1);
        },
        reqComments(page, shouldClear) {
            if (this.isLoading) {
                return;
            }
            this.isLoading = true;
            const lastCommentID = this.comments.length ? this.comments[this.comments.length - 1].id : '';
            let url = `/comments/${this.commentType}/${this.articleID}/${lastCommentID}`;
            myHTTP.get(url).then((res) => {
                this.isLoading = false;
                if (shouldClear) {
                    this.comments = [];
                }
                const comments = res.data.data.list || [];
                // key为评论的id，value为评论（所有的评论，包括子评论）
                const commentMap = this.commentMap || {};
                comments.forEach(comment => {
                    Vue.set(this.subCommentLoadStatusMap, comment.id, false);
                    comment.editorToggled = false;
                    comment.htmlContent = trim(comment.htmlContent);
                    comment.userLiked = false;
                    comment.comments = comment.comments || [];
                    commentMap[comment.id] = comment;
                    const subComments = comment.comments;
                    subComments.forEach(subComment => {
                        subComment.editorToggled = false;
                        subComment.userLiked = false;
                        subComment.parentComment = commentMap[subComment.parentID];
                        subComment.rootComment = commentMap[subComment.rootID];
                        commentMap[subComment.id] = subComment;
                    });
                });
                this.commentMap = commentMap;
                this.comments = this.comments.concat(comments);
                this.totalCount = res.data.data.totalCount || 0;
                this.page =  res.data.data.page;
                const pageSize =  res.data.data.pageSize;
                this.updateCommentsLiks();

                if (this.isFirstRequest && location.hash && location.hash.indexOf('#comments') === 0) {
                    setTimeout(() => {
                        document.getElementsByClassName('article-banner')[0].scrollIntoView();
                    }, 50);
                }
                this.isFirstRequest = false;

                console.log(comments);
            }).catch(err => {
                console.log(err);
                this.isLoading = false;
            });
        },
        onLoadSub(parentComment) {
            if (this.subCommentLoadStatusMap[parentComment.id]) {
                return;
            }
            this.subCommentLoadStatusMap[parentComment.id] = true;
            const lastID = parentComment.comments[parentComment.comments.length - 1].id;
            let url = `/comments/${this.commentType}/comment/${parentComment.id}/${lastID}`;
            myHTTP.get(url).then((res) => {
                this.subCommentLoadStatusMap[parentComment.id] = false;
                const commentMap = this.commentMap;
                const subComments = res.data.data.list;
                subComments.forEach(subComment => {
                    subComment.editorToggled = false;
                    subComment.userLiked = false;
                    subComment.parentComment = commentMap[subComment.parentID];
                    subComment.rootComment = commentMap[subComment.rootID];
                    commentMap[subComment.id] = subComment;
                });
                parentComment.comments = parentComment.comments.concat(subComments);
            }).catch(err => {
                console.log(err);
                this.subCommentLoadStatusMap[parentComment.id] = false;
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
            comment.likedCount = 0;
            comment.comments = [];
            this.commentMap[comment.id] = comment;
            if (comment.parentID) {
                comment.parentComment = this.commentMap[comment.parentID];
                comment.rootComment = this.commentMap[comment.rootID];
                comment.parentComment.editorToggled = false;
            }
            if (comment.rootID) {
                this.commentMap[comment.rootID].comments.push(comment);
            } else {
                this.comments.push(comment);
            }
            this.totalCount += 1;
        },
        addCommentError(message) {
            this.$refs.errorTip.show(message);
        },
        onCancelComment(comment) {
            comment.editorToggled = false;
        },
        onLikeOrNot(comment) {
            let url = `/comments/${comment.id}/like?commentType=${this.commentType}`;
            if (!comment.userLiked) {
                myHTTP.post(url).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        comment.userLiked = true;
                        comment.likedCount++;
                    }
                });
            } else {
                myHTTP.delete(url).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        comment.userLiked = false;
                        comment.likedCount--;
                    }
                });
            }
        },
        onDeleteCommentOk() {
            if (!this.curWillDeleteComment) {
                return;
            }
            const url = `/comments/${this.curWillDeleteComment.id}?commentType=${this.commentType}`;
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
    filters: {
        jobCompany,
        levelImgURL,
    },
    components: {
        CommentRichEditor,
        SuccessTip,
        ErrorTip,
        UserBusinessCard,
        ZanIcon,
        ReplyIcon,
    }
};
</script>

<style lang="scss">
@import url(../../../styles/comment/comments.scss);
</style>
