<template>
    <div class="article-suspended-panel article-suspended-panel">
        <div @click="onLike" class="like-btn panel-btn like-adjust" :badge="articleLikedCount"
            :class="{active: articleUserLiked, 'with-badge': articleLikedCount}"></div>
        <div class="comment-btn panel-btn comment-adjust" :badge="articleCommentCount" :class="{'with-badge': articleCommentCount}"></div>
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
            articleUserLiked: window.userLiked,
            articleLikedCount: window.articleLikedCount,
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
                    }
                });
            } else {
                myHTTP.post(`/articles/${window.articleID}/like`).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        this.articleUserLiked = true;
                        this.articleLikedCount++;
                    } else if (res.data.errorCode === ErrorCode.LoginTimeout.CODE) {
                        location.href = '/signin.html';
                    }
                });
            }
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
    background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/zan.b4bb964.svg);
}

.panel-btn.like-btn.like-adjust {
    background-position: 53% 46%;
}

.panel-btn.like-btn:hover {
    background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/zan-hover.91657d6.svg);
}

.panel-btn.like-btn.active {
    background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/zan-active.337b9a0.svg);
}

.panel-btn.comment-btn {
    background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/comment.7fc22c2.svg);
}

.panel-btn.comment-btn:hover {
    background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/comment-hover.1074e67.svg);
}

.panel-btn.comment-btn.comment-adjust {
    background-position: 50% 55%;
}

.panel-btn.collect-btn {
    background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/collect.1db122b.svg);
}

.panel-btn.collect-btn.open, .panel-btn.collect-btn:hover {
    background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/collect-hover.5d446a7.svg);
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
    background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/weibo.2076a57.svg);
}

.panel-btn.weibo-btn:hover {
    background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/weibo-hover.9abf502.svg);
}

.panel-btn.qq-btn {
    display: block;
    background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/qq.0834411.svg);
}

.panel-btn.qq-btn:hover {
    background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/qq-hover.d11dd84.svg);
}

.panel-btn.wechat-btn {
    display: block;
    background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/wechat.63e1ce0.svg);
}

.panel-btn.wechat-btn:hover {
    background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/wechat-hover.c8ce019.svg);
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