import 'iview/dist/styles/iview.css';
import '~/styles/main.scss';
import '~/styles/article/articleDetail.scss';
import '~/js/common/default.js';
import {
    myHTTP,
} from '~/js/common/net.js';
import {
    addClass,
    removeClass,
} from '~/js/utils/dom.js';
import {
    ErrorCode,
} from '~/js/constants/error.js';

import Vue from 'vue';
import SmallFollow from '~/js/components/user/SmallFollow.vue';
import BigFollow from '~/js/components/user/BigFollow.vue';
import ArticleShareQRCodeWrap from '~/js/components/article/ArticleShareQRCodeWrap.vue';
import CommentsOfArticle from '~/js/components/comment/CommentsOfArticle.vue';

import {
    registerDirective,
} from '~/js/utils/vue.js';

registerDirective(Vue);

(function () {
    const methodProxy1 = {};
    const methodProxy2 = {};

    function onChange (userFollowed) {
        methodProxy1.setUserFollowed(userFollowed);
        methodProxy2.setUserFollowed(userFollowed);
    }

    function onFollowChange (userID, userFollowed) {
        if (userID === window.authorID) {
            methodProxy1.setUserFollowed(userFollowed);
            methodProxy2.setUserFollowed(userFollowed);
        }
    }

    // 关注作者
    new Vue({
        render: h => h(SmallFollow, {
            props: {
                userID: window.authorID,
                userFollowed: window.userFollowed,
                onChange: onChange,
                methodProxy: methodProxy1,
            },
        }),
    }).$mount('#followUserSmallBtn');

    // 关注作者
    new Vue({
        render: h => h(BigFollow, {
            props: {
                userID: window.authorID,
                userFollowed: window.userFollowed,
                onChange: onChange,
                methodProxy: methodProxy2,
            },
        }),
    }).$mount('#followUserBigBtn');

    // 评论列表
    new Vue({
        render: h => h(CommentsOfArticle, {
            props: {
                articleID: window.articleID,
                userID: window.userID,
                username: window.username,
                avatarURL: window.avatarURL,
                authorID: window.authorID,
                commentEnabled: window.commentEnabled,
                onFollowChange,
            },
        }),
    }).$mount('#normal-comment-list');
}());

// 微信分享文章
new Vue({
    render: h => h(ArticleShareQRCodeWrap, {
        props: {
            articleID: window.articleID,
        },
    }),
}).$mount('#articleShareQRCode');

// 喜欢文章
(function () {
    let articleUserLiked = window.userLiked;
    let articleLikeCount = window.articleLikeCount;
    const likeArticelBtn = document.getElementById('likeArticelBtn');
    if (articleUserLiked) {
        addClass(likeArticelBtn, 'active');
    }
    likeArticelBtn.addEventListener('click', function (event) {
        if (articleUserLiked) {
            myHTTP.post(`/articles/${window.articleID}/cancellike`).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    removeClass(likeArticelBtn, 'like-animation');
                    removeClass(likeArticelBtn, 'active');
                    articleLikeCount--;
                    articleUserLiked = false;
                    document.getElementById('articelLikeCount').innerHTML = articleLikeCount;
                }
            });
        } else {
            myHTTP.post(`/articles/${window.articleID}/like`).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    addClass(likeArticelBtn, 'like-animation');
                    addClass(likeArticelBtn, 'active');
                    articleLikeCount++;
                    articleUserLiked = true;
                    document.getElementById('articelLikeCount').innerHTML = articleLikeCount;
                } else if (res.data.errorCode === ErrorCode.LoginTimeout.CODE) {
                    location.href = '/signin.html';
                }
            });
        }
    });
}());

(function () {
    const QRCode = window.QRCode;
    const hostname = window.globalConfig.hostname;
    // http://davidshimjs.github.io/qrcodejs/
    // https://github.com/davidshimjs/qrcodejs

    // eslint-disable-next-line no-new
    new QRCode(document.getElementById('qrcodeContainer'), {
        text: `https://${hostname}/downloadapp`,
        width: 100,
        height: 100,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H,
    });
}());

// 更多分享
(function () {
    const articleMoreShareBtn = document.getElementById('articleMoreShareBtn');
    const shareListPop = document.getElementById('shareListPop');
    let shareListPopVisible = false;
    articleMoreShareBtn.addEventListener('click', function (event) {
        shareListPopVisible = !shareListPopVisible;
        if (shareListPopVisible) {
            shareListPop.style.display = 'block';
        } else {
            shareListPop.style.display = 'none';
        }
    });
    document.addEventListener('click', function (event) {
        if (articleMoreShareBtn.contains(event.target)) {
            return;
        }
        shareListPopVisible = false;
        shareListPop.style.display = 'none';
    });
}());
