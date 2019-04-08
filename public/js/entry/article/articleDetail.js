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
import ArticleShareQRCodeWrap from '~/js/components/article/ArticleShareQRCodeWrap.vue';
import CommentsOfArticle from '~/js/components/article/CommentsOfArticle.vue';

import {
    registerDirective,
} from '~/js/utils/vue.js';

registerDirective(Vue);

new Vue({
    render: h => h(CommentsOfArticle, {
        props: {
            articleID: window.articleID,
            userID: window.userID,
            username: window.username,
            avatarURL: window.avatarURL,
            authorID: window.authorID,
            commentEnabled: window.commentEnabled,
        },
    }),
}).$mount('#normal-comment-list');

new Vue({
    render: h => h(ArticleShareQRCodeWrap, {
        props: {
            articleID: window.articleID,
        },
    }),
}).$mount('#articleShareQRCode');

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
                }
            });
        }
    });
}());

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
