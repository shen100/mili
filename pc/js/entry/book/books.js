import '~/styles/main.scss';
import '~/styles/book/books.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import Books from '~/js/pages/book/Books.vue';
import {
    getScrollPos
} from '~/js/utils/dom.js';

new Vue({
    render: h => h(Books),
}).$mount('#books');

// 右侧悬浮
(function() {
    function setArticleSidebarPosition() {
        const sidebar = document.getElementsByClassName('side-box')[0];
        const scrollTop = getScrollPos().scrollTop;
        let top = 124 - scrollTop;
        top = top > 57 + 20 ? top : 57 + 20;
        sidebar.style.top = top + 'px';
    }

    window.addEventListener('scroll', function() {
        setArticleSidebarPosition();
    });
    window.addEventListener('resize', function() {
        setArticleSidebarPosition();
    });
}());

