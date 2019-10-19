import '~/styles/main.scss';
import '~/styles/book/bookDetail.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import {
    parseTree,
} from '~/js/utils/tree';
import BookDetail from '~/js/pages/book/BookDetail.vue';
import { addClass, removeClass, elementScrollToTop } from '~/js/utils/dom.js';

import {
    registerDirective,
} from '~/js/utils/vue.js';

registerDirective(Vue);

(function () {
    const treeData = parseTree(window.chapters, {
        titleKey: 'name',
        dataKeys: [
            'expand',
        ],
    });
    treeData.reverse();

    const book = window.book;
    const gotoChapterID = treeData[0].id;
    const gotoChapterBtn = document.getElementById('gotoChapterBtn');
    gotoChapterBtn.addEventListener('click', () => {
        location.href = `/books/${book.id}/chapters/${gotoChapterID}`;
    });
}());

if (book.starUserCount || book.commentCount) {
    new Vue({
        render: h => h(BookDetail, {
            props: {
                book: window.book,
            }
        }),
    }).$mount('#bookDetailStarComment');
}

const bookMenuNavItem = document.getElementById('bookMenuNavItem');
const starNavItem = document.getElementById('starNavItem');
const commentNavItem = document.getElementById('commentNavItem');

const topNavHeight = 57;

function scrollIntoView(el) {
    bookMenuNavItem && removeClass(bookMenuNavItem, 'active');
    starNavItem && removeClass(starNavItem, 'active');
    commentNavItem && removeClass(commentNavItem, 'active');
    addClass(el, 'active');
    if (el === bookMenuNavItem) {
        elementScrollToTop(bookMenuNavItem, topNavHeight);
    } else {
        elementScrollToTop(document.getElementById('bookDetailStarComment'), topNavHeight);
    }
}

bookMenuNavItem.addEventListener('click', () => {
    scrollIntoView(bookMenuNavItem);
});

if (starNavItem) {
    starNavItem.addEventListener('click', () => {
        scrollIntoView(starNavItem);
    });
}

if (commentNavItem) {
    commentNavItem.addEventListener('click', () => {
        scrollIntoView(commentNavItem);
    });
}