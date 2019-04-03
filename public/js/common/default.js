import Vue from 'vue';
import TopNavSearch from '~/js/components/TopNavSearch.vue';
import {
    addClass,
    removeClass,
    hasClass,
} from '~/js/utils/dom.js';

import {
    registerDirective,
} from '~/js/utils/vue.js';

registerDirective(Vue);

const navbarUser = document.getElementsByClassName('navbar-user')[0];

if (navbarUser) {
    document.addEventListener('click', (event) => {
        if (navbarUser.contains(event.target)) {
            return;
        }
        const userDropdownBox = document.getElementById('userDropdownBox');
        if (!userDropdownBox) {
            return;
        }
        removeClass(userDropdownBox, 'open');
    });

    navbarUser.addEventListener('click', () => {
        const userDropdownBox = document.getElementById('userDropdownBox');
        if (!userDropdownBox) {
            return;
        }
        if (hasClass(userDropdownBox, 'open')) {
            removeClass(userDropdownBox, 'open');
        } else {
            addClass(userDropdownBox, 'open');
        }
    });
}

if (document.getElementById('topnavsearch')) {
    new Vue({
        render: h => h(TopNavSearch),
    }).$mount('#topnavsearch');
}
