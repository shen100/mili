import '~/styles/main.scss';
import '~/styles/article/articleDisplay.scss';
import '~/styles/article/articleDetail.scss';
import '~/js/common/default.js';
import {
    getWindowSize
} from '~/js/utils/dom.js';

import Vue from 'vue';
import FollowBtn from '~/js/components/user/FollowBtn.vue';
import CommentList from '~/js/components/comment/CommentList.vue';
import ArticleSocial from '~/js/components/article/ArticleSocial.vue';

import {
    registerDirective,
} from '~/js/utils/vue.js';

registerDirective(Vue);

// 关注作者
(function () {
    const authorID = window.authorID;
    if (!window.isAuthorSelf) {
        new Vue({
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

        new Vue({
            render: h => h(FollowBtn, {
                props: {
                    userID: authorID,
                    followed: window.userFollowed,
                },
                style: { float: 'right' }
            }),
        }).$mount('#followUserBigBtn');
    }
}());

// 评论列表
(function() {
    new Vue({
        render: h => h(CommentList, {
            props: {
                commentType: 'article',
                articleID: window.articleID,
                userID: window.userID,
                username: window.username,
                avatarURL: window.avatarURL,
                authorID: window.authorID,
                rootCommentCount: window.rootCommentCount,
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

// 右侧悬浮
(function() {
    function setArticleSidebarPosition() {
        const articleSidebar = document.getElementsByClassName('article-sidebar')[0];
        const winWidth = getWindowSize().width;
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
