import '~/styles/main.scss';
import '~/styles/book/bookDetail.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import {
    parseTree,
} from '~/js/utils/tree';

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
        location.href = `/books/${book.id}/chapters/${gotoChapterID}.html`;
    });
}());
