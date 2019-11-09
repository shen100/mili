import '~/styles/main.scss';
import '~/styles/index.css';
import '~/js/common/default.js';
import Vue from 'vue';
import Index from '~/js/pages/Index.vue';

import {
    getScrollPos
} from '~/js/utils/dom.js';

import {
    registerDirective,
} from '~/js/utils/vue.js';

registerDirective(Vue);

new Vue({
    render: h => h(Index),
}).$mount('#articleList');

// 右侧悬浮
(function() {
    function setRightSidebarPosition() {
        const sidebar = document.getElementsByClassName('home-sidebar')[0];
        const scrollTop = getScrollPos().scrollTop;
        let top = 124 - scrollTop;
        top = top > 57 + 20 ? top : 57 + 20;
        sidebar.style.top = top + 'px';
    }

    window.addEventListener('scroll', function() {
        setRightSidebarPosition();
    });
    window.addEventListener('resize', function() {
        setRightSidebarPosition();
    });
}());
