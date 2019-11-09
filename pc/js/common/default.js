import Vue from 'vue';
import TopNavSearch from '~/js/components/TopNavSearch.vue';
import UserDropdown from '~/js/components/common/UserDropdown.vue';
import {
    getScrollPos,
} from '~/js/utils/dom.js';

import {
    registerDirective,
} from '~/js/utils/vue.js';

registerDirective(Vue);

(function() {
    if (window.user) {
        const navbarUserArr = document.getElementsByClassName('navbar-user');
        if (!navbarUserArr || !navbarUserArr[0]) {
            return;
        }
        new Vue({
            render: h => h(UserDropdown, {
                props: {
                    userID: window.user.id,
                    avatarURL: window.user.avatarURL,
                    menuAlign: 'right'
                },
            }),
        }).$mount('.navbar-user');
    }
}());

if (document.getElementById('topnavsearch')) {
    new Vue({
        render: h => h(TopNavSearch),
    }).$mount('#topnavsearch');
}

const sideTool = document.getElementsByClassName('side-tool')[0];
if (sideTool) {
    const toTopBtn = document.getElementById('toTopBtn');
    window.addEventListener('scroll', function() {
        const scrollTop = getScrollPos().scrollTop;
        if (scrollTop > 0) {
            toTopBtn.style.display = 'block';
        } else {
            toTopBtn.style.display = 'none';
        }
    });
    toTopBtn.addEventListener('click', function() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
}

window.defaultJSLoaded = true;
