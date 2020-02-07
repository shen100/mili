<template>
    <div id="normal-comment-list" class="normal-comment-list">
        <SuccessTip ref="successTip" />
        <ErrorTip ref="errorTip" />
        <div id="comments">
            <!-- 未登录时显示登录form -->
            <form v-if="!user" class="new-comment" style="margin-top: 15px;" 
                :style="{'margin-left': source === 'boilingpoint' ? '56px' : '48px', 'padding-right': source === 'boilingpoint' ? '12px' : '0'}">
                <a href="javascript:void(0);" class="avatar" style="cursor: default;">
                    <img style="cursor: default;" src="../../../images/avatar_default.png">
                </a>
                <div class="sign-container">
                    <a :href="signinURL" class="btn btn-sign">登录</a>
                    <span>后发表评论</span>
                </div>
            </form>
            <!-- 评论列表 -->
            <div class="comments">
                <div v-if="user" v-clickoutside="onClickOutsideCommentEditor" :data-commentid="0" class="comment-source-box">
                    <div class="avatar-box">
                        <div class="avatar" style="cursor: default;" :style="{'background-image': `url(${user.avatarURL})`}"></div>
                    </div>
                    <div class="comment-source-box-wrap">
                        <CommentRichEditor v-if="user" :collectionID="collectionID" :sourceID="sourceID" 
                            emptyPlaceholder="写下你的评论" @success="addCommentSuccess" @error="addCommentError" 
                            :source="source" :sendDefVisible="false" :disableInputBlur="true" 
                            ref="commentEditor-0" />
                    </div>
                </div>
                <div v-else style="height: 20px;"></div>              
                <div v-for="comment in comments" class="comment lastchild-flag" 
                    :key="`comment-${comment.id}`" :id="`comment-${comment.id}`">
                    <div class="comment-avatar-area v-tooltip-container" 
                        :style="{'z-index': comment.id === mouseenterCommentID && mouseenterCommentTarget === 'avatar' ? visibleZIndex : defaultZIndex}"
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
                            <div class="user-popover-box" 
                                    :style="{'z-index': comment.id === mouseenterCommentID && mouseenterCommentTarget === 'username' ? visibleZIndex : defaultZIndex}"
                                    @mouseenter="onMouseEnterUser(comment.id, 'username')"
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
                                <div @click="onLikeOrNot(comment)" class="like-action" :class="{active: comment.userLiked}">
                                    <ZanIcon :active="comment.userLiked" />
                                    <span class="action-title">{{comment.likedCount || ''}}</span>
                                </div>
                                <div class="comment-reply" @click.stop.prevent="onAddComment(comment)">
                                    <ReplyIcon />
                                    <span class="action-title">回复</span>
                                </div>
                            </div>
                        </div>

                        <!-- 回复评论 -->
                        <div v-if="user && comment.editorToggled" v-clickoutside="onClickOutsideCommentEditor" :data-commentid="comment.id" class="comment-root-box">
                            <div class="comment-source-box-wrap">
                                <CommentRichEditor :collectionID="collectionID" :sourceID="sourceID" 
                                    :emptyPlaceholder="`回复${comment.user.username}`"
                                    :rootID="comment.id" @success="addCommentSuccess"
                                    @error="addCommentError" :parentID="comment.id" 
                                    @cancel="onCancelComment(comment)"
                                    :source="source" :disableInputBlur="true" :ref="`commentEditor-${comment.id}`" />
                            </div>
                        </div>
                        
                        <!-- 子评论 -->
                        <div v-if="comment.comments && comment.comments.length" class="sub-comment-list">
                            <div :id="`comment-${subcomment.id}`" :key="`comment-${subcomment.id}`" 
                                v-for="(subcomment, i) in comment.comments" class="sub-comment" :style="{'padding-top': i === 0 ? '14px' : '12px'}">
                                <div class="v-tooltip-container"
                                    :style="{'z-index': subcomment.id === mouseenterCommentID && mouseenterCommentTarget === 'avatar' ? visibleZIndex : defaultZIndex}">
                                    <div class="v-tooltip-content" @mouseenter="onMouseEnterUser(subcomment.id, 'avatar')"
                                            @mouseleave="onMouseLeaveUser">
                                        <a :href="`/uc/${subcomment.user.id}`" target="_blank" class="avatar"><img :src="subcomment.user.avatarURL"></a>
                                        <UserBusinessCard v-if="subcomment.id === mouseenterCommentID && mouseenterCommentTarget === 'avatar'"
                                            :userID="subcomment.user.id" :followerID="userID" />
                                    </div>
                                </div>
                                <div class="subcomment-content-area">
                                    <div class="meta-box">
                                        <div class="user-popover-box" @mouseenter="onMouseEnterUser(subcomment.id, 'username')"
                                                @mouseleave="onMouseLeaveUser"
                                                :style="{'z-index': subcomment.id === mouseenterCommentID && mouseenterCommentTarget === 'username' ? visibleZIndex : defaultZIndex}">
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
                                        <div class="user-popover-box" @mouseenter="onMouseEnterUser(subcomment.id, 'parent_username')"
                                                @mouseleave="onMouseLeaveUser"
                                                :style="{'z-index': subcomment.id === mouseenterCommentID && mouseenterCommentTarget === 'parent_username' ? visibleZIndex : defaultZIndex}">
                                            <a :href="`/uc/${subcomment.parent.user.id}`" target="_blank" class="username be-replied">{{subcomment.parent.user.username}}
                                                <a :href="userLevelChapterURL" target="_blank" class="rank">
                                                    <img :src="subcomment.parent.user.level | levelImgURL">
                                                </a>
                                            </a>
                                            <UserBusinessCard v-if="subcomment.id === mouseenterCommentID && mouseenterCommentTarget === 'parent_username'"
                                                :userID="subcomment.parent.user.id" :followerID="userID" />
                                        </div>
                                        <span>: </span>
                                        <div class="sub-comment-wrap" v-html="subcomment.htmlContent"></div>
                                    </div>

                                    <div class="comment-operate" style="margin-bottom: 0;">
                                        <div class="comment-time"><span>{{subcomment.createdAtLabel}}</span></div>
                                        <div class="comment-action-box">
                                            <div @click="onLikeOrNot(subcomment)" class="like-action" :class="{active: subcomment.userLiked}">
                                                <ZanIcon :active="subcomment.userLiked" />
                                                <span class="action-title">{{subcomment.likedCount || ''}}</span>
                                            </div>
                                            <div class="comment-reply" @click.stop.prevent="onAddComment(subcomment)">
                                                <ReplyIcon />
                                                <span class="action-title">回复</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="user && subcomment.editorToggled" v-clickoutside="onClickOutsideCommentEditor" :data-commentid="subcomment.id" class="comment-sub-box">
                                        <div class="comment-source-box-wrap">
                                            <CommentRichEditor :emptyPlaceholder="`回复${subcomment.user.username}`"
                                                :collectionID="collectionID" :sourceID="sourceID" :rootID="comment.id" 
                                                :parentID="subcomment.id" @success="addCommentSuccess" @error="addCommentError"
                                                @cancel="onCancelComment(subcomment)" 
                                                :source="source" :disableInputBlur="true" :ref="`commentEditor-${subcomment.id}`" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 一级评论的子评论未加载完时的加载按钮 -->
                            <div v-if="comment.comments.length < comment.commentCount" @click="onLoadSub(comment)" class="sub-comment fetch-more">
                                <div class="fetch-more-comment">{{subCommentLoadStatusMap[comment.id] ? '正在加载...' : '查看更多 >'}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 一级评论未加载完时的加载按钮 -->
            <div v-if="comments.length < theRootCommentCount" @click="onLoadMore" 
                class="fetch-more-comment">{{isLoading ? '正在加载...' : '查看更多 >'}}</div>
            <div v-else-if="source !== 'boilingpoint'" style="height: 24px;"></div>
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
        // article: 文章的评论;  bookchapter: 开源图书章节的评论; createboilingpoint: 创建沸点; boilingpoint: 沸点的评论
        'source',
        'rootCommentCount', // 一级评论数
        'collectionID', // 如果是图书章节的评论，那么collectionID就是 图书id
        'sourceID', // 如果是文章的评论，那么是文章id, 如果是图书章节的评论，那么是 章节id
        'authorID',
        'user', // 当前登录用户
    ],
    data: function() {
        return {
            signinURL: '/signin?miliref=' + encodeURIComponent(location.href),
            theRootCommentCount: this.rootCommentCount,
            commentMap: {}, // 所有的评论, key 是 评论id, value 是 评论
            subCommentLoadStatusMap: {}, // key 是父评论id, value 是 是否正在加载子评论
            comments: [],
            isLoading: false, // 是否正在加载一级评论
            mouseenterCommentID: undefined,
            mouseenterCommentTarget: '',
            isFirstRequest: true, // 请求评论列表，发出的第一个请求（浏览器地址栏中有#comments的话，滚动到评论区)
            userLevelChapterURL: window.userLevelChapterURL,
            willReplySubComment: null, // 将对此子评论进行评论
            visibleZIndex: 999,
            defaultZIndex: 1,
        };
    },
    computed: {
        userID: function() {
            return this.user && this.user.id || undefined;
        }
    },
    mounted: function() {
        this.onLoadMore();
    },
    methods: {
        reset() {
            this.signinURL = '/signin?miliref=' + encodeURIComponent(location.href);
            this.theRootCommentCount = this.rootCommentCount;
            this.commentMap = {};
            this.subCommentLoadStatusMap = {};
            this.comments = [];
            this.isLoading = false;
            this.mouseenterCommentID = undefined;
            this.mouseenterCommentTarget = '';
            this.willReplySubComment = null;
            this.onLoadMore();
        },
        onMouseEnterUser(commentID, mouseenterCommentTarget) {
            this.mouseenterCommentID = commentID;
            this.mouseenterCommentTarget = mouseenterCommentTarget;
        },
        onMouseLeaveUser() {
            this.mouseenterCommentID = undefined;
        },
        // 加载一级评论
        onLoadMore() {
            if (this.isLoading) {
                return;
            }
            this.isLoading = true;
            const limit = this.isFirstRequest ? 6 : 20;
            const lastCommentID = this.comments.length ? this.comments[this.comments.length - 1].id : '';
            let url = `/comments/${this.source}/${this.sourceID}/${lastCommentID}?limit=${limit}`;
            myHTTP.get(url).then((res) => {
                this.isLoading = false;
                const comments = res.data.data.list || [];
                // key为评论的id，value为评论（所有的评论，包括子评论）
                const commentMap = this.commentMap || {};
                comments.forEach(comment => {
                    Vue.set(this.subCommentLoadStatusMap, comment.id, false);
                    comment.editorToggled = false;
                    comment.htmlContent = trim(comment.htmlContent);
                    comment.comments = comment.comments || [];
                    commentMap[comment.id] = comment;
                    const subComments = comment.comments;
                    subComments.forEach(subComment => {
                        subComment.editorToggled = false;
                        subComment.htmlContent = trim(subComment.htmlContent);
                        commentMap[subComment.id] = subComment;
                    });
                });
                this.commentMap = commentMap;
                this.comments = this.comments.concat(comments);

                if (this.isFirstRequest && location.hash && location.hash.indexOf('#comments') === 0) {
                    setTimeout(() => {
                        // 滚动到评论区
                        document.getElementsByClassName('comment-scroll-to')[0].scrollIntoView();
                    }, 50);
                }
                this.isFirstRequest = false;
            }).catch(err => {
                console.log(err);
                this.isLoading = false;
            });
        },
        // 加载子评论
        onLoadSub(parentComment) {
            // 已在加载一级评论的子评论时，就直接返回
            if (this.subCommentLoadStatusMap[parentComment.id]) {
                return;
            }
            this.subCommentLoadStatusMap[parentComment.id] = true;
            const lastID = parentComment.comments[parentComment.comments.length - 1].id;
            let url = `/comments/${this.source}/comment/${parentComment.id}/${lastID}?limit=5`;
            myHTTP.get(url).then((res) => {
                this.subCommentLoadStatusMap[parentComment.id] = false;
                const commentMap = this.commentMap;
                const subComments = res.data.data.list;
                subComments.forEach(subComment => {
                    subComment.editorToggled = false;
                    subComment.htmlContent = trim(subComment.htmlContent);
                    commentMap[subComment.id] = subComment;
                });
                parentComment.comments = parentComment.comments.concat(subComments);
            }).catch(err => {
                console.log(err);
                this.subCommentLoadStatusMap[parentComment.id] = false;
            });
        },
        onAddComment(comment) {
            const commentEditor = this.getCommentEditor(0);
            if (commentEditor) {
                commentEditor.hideSendBtn();
                commentEditor.blur();
            }
            comment.editorToggled = !comment.editorToggled;
            if (comment.editorToggled) {
                if (this.willReplySubComment) {
                    this.willReplySubComment.editorToggled = false;
                }
                this.willReplySubComment = comment;
            } else {
                this.willReplySubComment = null;
            }
            if (comment.editorToggled) {
                this.$nextTick(() => {
                    const theCommentEditor = this.getCommentEditor(comment.id);
                    if (theCommentEditor) {
                        theCommentEditor.focus();
                    }
                });
            }
        },
        addCommentSuccess(comment) {
            this.$refs.successTip.show('回复成功');
            comment.user = this.user;
            comment.editorToggled = false;
            comment.userLiked = false;
            comment.likedCount = 0;
            comment.commentCount = 0;
            comment.comments = [];
            this.commentMap[comment.id] = comment;
            if (comment.parentID) {
                comment.parent = this.commentMap[comment.parentID];
                comment.parent.editorToggled = false;
            }
            if (comment.rootID) {
                this.commentMap[comment.rootID].comments.unshift(comment);
                this.commentMap[comment.rootID].commentCount++;
            } else {
                this.comments.unshift(comment);
                this.theRootCommentCount++;
                const commentEditor = this.getCommentEditor(0);
                if (commentEditor) {
                    commentEditor.hideSendBtn();
                    commentEditor.blur();
                }
            }
            this.willReplySubComment = null;
            this.$emit('comment-success');
        },
        addCommentError(message) {
            this.$refs.errorTip.show(message);
        },
        onCancelComment(comment) {
            comment.editorToggled = false;
        },
        onLikeOrNot(comment) {
            let url = `/comments/${this.source}/comment/${comment.id}/like`;
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
        onClickOutsideCommentEditor(event, dataset) {
            let commentEditor = this.getCommentEditor(dataset.commentid);
            if (commentEditor) {
                commentEditor.hideSendBtn();
                commentEditor.blur();
                // dataset.commentid 为 0 的话，是直接发表一级评论，此时 this.commentMap[dataset.commentid]为 undefined
                if (this.commentMap[dataset.commentid]) {
                    this.commentMap[dataset.commentid].editorToggled = false;
                    this.willReplySubComment = null;
                }
            }
        },
        getCommentEditor(id) {
            let commentEditor = this.$refs[`commentEditor-${id}`];
            if (commentEditor && commentEditor.length && commentEditor[0]) {
                commentEditor = commentEditor[0];
            }
            return commentEditor;
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

<style lang="scss" scoped>
.comment-source-box {
    display: flex;
    background-color: #fafbfc;
    padding: 12px 16px;
}

.avatar-box {
    flex: 0 0 auto;
    margin-right: 12px;
}

.avatar-box .avatar {
    width: 32px;
    height: 32px;
    display: inline-block;
    position: relative;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #eee;
}

.comment-source-box-wrap {
    flex: 1 1 auto;
}

.comment-root-box {
    display: flex;
    background-color: #fafbfc;
    padding: 12px 16px;
    margin-bottom: 12px;
}

.comment-sub-box {
    margin-top: 12px;
    display: flex;
    background-color: #fff;
    padding: 12px 16px;
}

.comments .comment {
    display: flex;
    padding: 15px 12px 0 62px;
}

.comment-content-area {
    flex: 1 1 auto;
    margin-left: 9px;
}

.comments .comment:last-child .sub-comment-list {
    margin-bottom: 0;
}

.subcomment-content-area {
    flex: 1 1 auto;
    margin-left: 9px;
    margin-right: 12px;
    padding-bottom: 12px;
}

.sub-comment-list .sub-comment:not(:last-child) .subcomment-content-area {
    border-bottom: 1px solid #f1f1f1;
}

.comment-content-area .meta-box, .subcomment-content-area .meta-box {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 1.2;
    white-space: nowrap;
}

.comment-content-area .author .name:hover, .subcomment-content-area .author .name:hover {
    text-decoration: none;
}

.user-popover-box {
    display: inline;
    position: relative;
    z-index: 1;
}

.meta-box .position {
    color: #8a9aa9;
    font-size: 14px;
    margin-left: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 192px;
}

.meta-box .username {
    flex: 1 1 auto;
    width: 0;
    color: #333;
    font-size: 14px;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.meta-box .username:hover {
    text-decoration: none;
}

.rank {
    margin-left: 4px;
    vertical-align: middle;
    height: auto;
    line-height: normal;
}

.meta-box .author-badge-text {
    margin-left: 4px;
}

.comments .lastchild-flag:not(:last-child) .comment-content-area {
    border-bottom: 1px solid #f1f1f1;
}

.article .author {
    margin: 0 0 40px;
}

.comments .comment .author {
    margin-bottom: 5px;
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
    position: relative;
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

.comments .comment .sub-tool-group a span {
    vertical-align: middle;
}

.comments .comment .more-comment {
    font-size: 14px;
    color: #969696;
    border: none;
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
    border-bottom: 0!important;
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

.comment-wrap {
    margin-top: 7px;
    word-wrap: break-word;
    white-space: pre-wrap;
    word-break: break-all;
    color: #505050;
}

.comment-wrap pre, .comment-content-box pre {
    word-spacing: normal;
    word-wrap: normal;
    word-break: break-word!important;
    word-break: break-all;
    overflow: auto;
}

.comment-operate {
    display: flex;
    margin: 12px 0;
    font-weight: 400;
}

.comment-time {
    font-size: 14px;
    color: #8a93a0;
    cursor: default;
}

.comment-action-box {
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
    margin-left: auto;
    min-width: 100px;
    user-select: none;
}

.comment-action-box .like-action {
    display: flex;
    align-items: center;
    margin-left: 6px;
    cursor: pointer;
}

.comment-action-box .action-title {
    margin-left: 3px;
    color: #8a93a0;
    font-size: 12px;
    height: 16px;
}

.comment-action-box .like-action.active .action-title {
    color: #37c700;
}

.comment-action-box .comment-reply {
    display: flex;
    align-items: center;
    margin-left: 6px;
    cursor: pointer;
}

.comment-content-box div, .comment-content-box p {
    display: inline;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 16px!important;
}

.comments .sub-comment-list {
    margin: 15px 0;
    padding: 0 0 0 12px;
    background-color: #fafbfc;
    border-radius: 3px;
}

.sub-comment {
    display: flex;
    padding-top: 12px;
}

.fetch-more {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 0;
}

.fetch-more-comment {
    display: block;
    padding: 12px 0;
    font-size: 12px;
    text-align: center;
    color: #406599;
    cursor: pointer;
    user-select: none;
}

.sub-content-box {
    margin-top: 6px;
    font-size: 13px;
}

.sub-comment-wrap, .sub-comment-wrap p {
    display: inline;
}

.sub-content-box .user-popover-box a.be-replied {
    color: #406599;
}

.sub-content-box .user-popover-box a.be-replied:hover {
    text-decoration: none;
}

.no-border-bottom {
    border-bottom: none!important;
}

.no-border-top {
    border-top: none!important;
}

.comments .avatar {
    margin-right: 0!important;
    width: 32px;
    height: 32px;
    vertical-align: middle;
    display: inline-block;
    border: 1px solid #ddd;
    border-radius: 50%;
    cursor: pointer;
}

.avatar img {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
    border-radius: 50%;
    vertical-align: middle;
    cursor: pointer;
}

.comments .avatar img {
    border: none;
}

.author .info {
    vertical-align: middle;
    display: inline-block;
    margin-left: 0;
}

.author .meta {
    margin-top: 5px;
    font-size: 12px;
    color: #969696;
}

.author .meta span {
    padding-right: 5px;
}

.comment-avatar-area {
    height: 40px;
    z-index: 1;
}

.article .comment-list {
    padding-top: 0;
    box-sizing: border-box;
}

.article .comment-list .normal-comment-list {
    padding-top: 10px;
}

.article .comment-list .new-comment {
    position: relative;
    margin-left: 48px;
}

.article .comment-list .avatar {
    margin-right: 5px;
    width: 38px;
    height: 38px;
    vertical-align: middle;
    display: inline-block;
    border: 1px solid #ddd;
    border-radius: 50%;
}

.article .comment-list .new-comment .avatar {
    position: absolute;
    left: -48px;
}

.article .comment-list .new-comment .sign-container {
    box-sizing: border-box;
    text-align: center;
    padding: 10px 15px;
    width: 100%;
    height: 80px;
    font-size: 13px;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
    background-color: hsla(0, 0%, 71%, .1);
    resize: none;
    display: inline-block;
    vertical-align: top;
    outline-style: none;
}

.article .comment-list .new-comment .btn-sign {
    width: 78px;
    margin: 11px 10px 0 0;
    padding: 7px 18px;
    font-size: 16px;
    border: none;
    border-radius: 20px;
    color: #fff!important;
    background-color: #3194d0;
    outline: none;
    box-sizing: border-box;
}

.article .comment-list .new-comment span {
    font-size: 14px;
    vertical-align: -7px;
}

.article .comment-list .new-comment .btn-sign:hover {
    background-color: #187cb7;
}
</style>
