<template>
    <div class="article-suspended-panel article-suspended-panel">
        <div @click="onLike" class="like-btn panel-btn like-adjust" :badge="articleLikedCount"
            :class="{active: articleUserLiked, 'with-badge': articleLikedCount}"></div>
        <div @click="onCommentClick" class="comment-btn panel-btn comment-adjust" :badge="articleCommentCount" :class="{'with-badge': articleCommentCount}"></div>
        <div class="collect-btn panel-btn"></div>
        <div class="share-title">分享</div>
        <a :href="weiboShareURL" target="_blank" class="weibo-btn share-btn panel-btn"></a>
        <a :href="qqShareURL" target="_blank" class="qq-btn share-btn panel-btn"></a>
        <div class="wechat-btn share-btn panel-btn" @click="onWeixinShareClick"></div>
        <ArticleShareQRCode ref="qrCodePopup" :url="weixinShareURL"/>
    </div>
</template>

<script>
import { ErrorCode } from '~/js/constants/error.js';
import { myHTTP } from '~/js/common/net.js';
import ArticleShareQRCode from '~/js/components/article/ArticleShareQRCode.vue';

export default {
    data() {
        return {
            articleID: window.articleID,
            articleUserLiked: window.userLiked, // 当前用户是否已对此文章点过赞
            articleLikedCount: window.articleLikedCount, // 文章点赞数
            articleCommentCount: window.articleCommentCount,
            weiboShareURL: window.weiboShareURL,
            qqShareURL: window.qqShareURL,
            weixinShareURL: window.weixinShareURL,
        };
    },
    methods: {
        onLike() {
            if (this.articleUserLiked) {
                myHTTP.post(`/articles/${window.articleID}/cancellike`).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        this.articleUserLiked = false;
                        this.articleLikedCount--;
                    } else if (res.data.errorCode === ErrorCode.LoginTimeout.CODE) {
                        location.href = '/signin?ref=' + encodeURIComponent(location.href);
                    }
                });
            } else {
                myHTTP.post(`/articles/${window.articleID}/like`).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        this.articleUserLiked = true;
                        this.articleLikedCount++;
                    } else if (res.data.errorCode === ErrorCode.LoginTimeout.CODE) {
                        location.href = '/signin?ref=' + encodeURIComponent(location.href);
                    }
                });
            }
        },
        onCommentClick() {
            location.href = `/p/${this.articleID}#comments`;
            // 视图滚动到评论
            document.getElementsByClassName('article-banner')[0].scrollIntoView();
        },
        onWeixinShareClick() {
            this.$refs.qrCodePopup.show();
        }
    },
    components: {
        ArticleShareQRCode,
    }
}
</script>

<style lang="scss">
.article-suspended-panel {
    position: fixed;
    z-index: 1050;
    margin-left: -84px;
    top: 200px;
}

.panel-btn {
    position: relative;
    margin-bottom: 10px;
    width: 36px;
    height: 36px;
    background-color: #fff;
    background-position: 50%;
    background-repeat: no-repeat;
    border-radius: 50%;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .04);
    cursor: pointer;
}

.panel-btn.like-btn {
    background-image: url(../../../images/article/social_zan.svg);
}

.panel-btn.like-btn.like-adjust {
    background-position: 53% 46%;
}

.panel-btn.like-btn:hover {
    background-image: url(../../../images/article/social_zan_hover.svg);
}

.panel-btn.like-btn.active {
    background-image: url(../../../images/article/social_zan_active.svg);
}

.panel-btn.comment-btn {
    background-image: url(../../../images/article/social_comment.svg);
}

.panel-btn.comment-btn:hover {
    background-image: url(../../../images/article/social_comment_hover.svg);
}

.panel-btn.comment-btn.comment-adjust {
    background-position: 50% 55%;
}

.panel-btn.collect-btn {
    background-image: url(../../../images/article/social_collect.svg);
}

.panel-btn.collect-btn.open, .panel-btn.collect-btn:hover {
    background-image: url(../../../images/article/social_collect_hover.svg);
}

.share-title {
    margin: 30px 0 12px;
    font-size: 12px;
    text-align: center;
    color: #c6c6c6;
    user-select: none;
}

.panel-btn.weibo-btn {
    display: block;
    background-image: url(../../../images/article/social_weibo.svg);
}

.panel-btn.weibo-btn:hover {
    background-image: url(../../../images/article/social_weibo_hover.svg);
}

.panel-btn.qq-btn {
    display: block;
    background-image: url(../../../images/article/social_qq.svg);
}

.panel-btn.qq-btn:hover {
    background-image: url(../../../images/article/social_qq_hover.svg);
}

.panel-btn.wechat-btn {
    display: block;
    background-image: url(../../../images/article/social_wechat.svg);
}

.panel-btn.wechat-btn:hover {
    background-image: url(../../../images/article/social_wechat_hover.svg);
}

.panel-btn.with-badge:after {
    content: attr(badge);
    position: absolute;
    top: 0;
    left: 75%;
    padding: 1px 5px;
    font-size: 12px;
    text-align: center;
    line-height: 1;
    white-space: nowrap;
    color: #fff;
    background-color: #b2bac2;
    border-radius: 8px;
    transform-origin: left top;
    transform: scale(.75);
}

.panel-btn:not(.share-btn).active.with-badge:after {
    background-color: #74ca46;
}
</style>