import '~/styles/main.scss';
import Vue from 'vue';
import TopNavSearch from '~/js/components/TopNavSearch.vue';
import {
    registerDirective,
} from '~/js/utils/vue.js';

registerDirective(Vue);

// $('.navbar-user').mouseenter(function() {
//     $('.navbar-user .user').addClass('open');
// });

// $('.navbar-user').mouseleave(function() {
//     $('.navbar-user .user').removeClass('open');
// });

if ($('#topnavsearch').length) {
    new Vue({
        render: h => h(TopNavSearch),
    }).$mount('#topnavsearch');
}