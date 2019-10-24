import 'iview/dist/styles/iview.css';
import '~/styles/main.scss';
import '~/styles/article/articleDisplay.scss';
import '~/styles/article/articleDetail.scss';
import '~/js/common/default.js';
import {
    myHTTP,
} from '~/js/common/net.js';
import {
    addClass,
    removeClass,
    getScrollPos,
    getWindowSize
} from '~/js/utils/dom.js';
import { eventEmitter, EVENTS } from '~/js/utils/event.js';
import {
    ErrorCode,
} from '~/js/constants/error.js';

import Vue from 'vue';
import FollowBtn from '~/js/components/user/FollowBtn.vue';
import CommentsOfArticle from '~/js/components/comment/CommentsOfArticle.vue';
import ArticleSocial from '~/js/components/article/ArticleSocial.vue';

import {
    registerDirective,
} from '~/js/utils/vue.js';

registerDirective(Vue);

(function () {
    const authorID = window.authorID;
    let smallFollowBtn, bigFollowBtn;
    if (!window.isAuthorSelf) {
        // 关注作者
        smallFollowBtn = new Vue({
            render: h => h(FollowBtn, {
                props: {
                    userID: authorID,
                    followed: window.userFollowed,
                },
                style: {
                    width: '56px',
                    height: '26px',
                }
            }),
        }).$mount('#followUserSmallBtn');

        // 关注作者
        bigFollowBtn = new Vue({
            render: h => h(FollowBtn, {
                props: {
                    userID: authorID,
                    followed: window.userFollowed,
                },
                style: { float: 'right' }
            }),
        }).$mount('#followUserBigBtn');
    }

    eventEmitter.on(EVENTS.USER_FOLLOW_CHANGE, (data) => {
        if (data.userID === authorID) {
            smallFollowBtn.changeFollow(data.userID, data.isFollowed);
            bigFollowBtn.changeFollow(data.userID, data.isFollowed);
        }
    });

    // 评论列表
    new Vue({
        render: h => h(CommentsOfArticle, {
            props: {
                commentType: 'article',
                articleID: window.articleID,
                userID: window.userID,
                username: window.username,
                avatarURL: window.avatarURL,
                authorID: window.authorID,
            },
        }),
    }).$mount('#normal-comment-list');
}());

// 左侧边栏分享
(function() {
    new Vue({
        render: h => h(ArticleSocial, {
            props: {
                articleID: window.articleID,
            },
        }),
    }).$mount('#articleSuspendedPanel');
}());

(function () {
    // const QRCode = window.QRCode;
    // // http://davidshimjs.github.io/qrcodejs/
    // // https://github.com/davidshimjs/qrcodejs

    // // eslint-disable-next-line no-new
    // new QRCode(document.getElementById('qrcodeContainer'), {
    //     text: `${url}/downloadapp`,
    //     width: 100,
    //     height: 100,
    //     colorDark: '#000000',
    //     colorLight: '#ffffff',
    //     correctLevel: QRCode.CorrectLevel.H,
    // });
}());

// 更多分享
(function () {
    // const articleMoreShareBtn = document.getElementById('articleMoreShareBtn');
    // const shareListPop = document.getElementById('shareListPop');
    // let shareListPopVisible = false;
    // articleMoreShareBtn.addEventListener('click', function (event) {
    //     shareListPopVisible = !shareListPopVisible;
    //     if (shareListPopVisible) {
    //         shareListPop.style.display = 'block';
    //     } else {
    //         shareListPop.style.display = 'none';
    //     }
    // });
    // document.addEventListener('click', function (event) {
    //     if (articleMoreShareBtn.contains(event.target)) {
    //         return;
    //     }
    //     shareListPopVisible = false;
    //     shareListPop.style.display = 'none';
    // });
}());

(function() {
    function setArticleSidebarPosition() {
        const articleSidebar = document.getElementsByClassName('article-sidebar')[0];
        // articleSidebar.style.display = 'position';
        const scrollTop = getScrollPos().scrollTop;
        const winWidth = getWindowSize().width;
        console.log('winWidth', winWidth);
        articleSidebar.style.position = 'fixed';
        articleSidebar.style.top = '75px';
        articleSidebar.style.left = ((winWidth - 960) / 2 + 700 + 20) + 'px';
    }

    window.addEventListener('scroll', function() {
        setArticleSidebarPosition();
    });
    window.addEventListener('resize', function() {
        setArticleSidebarPosition();
    });
}());