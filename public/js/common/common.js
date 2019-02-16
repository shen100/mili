import '~/styles/main.scss';
import Vue from 'vue';
import TopNavSearch from '~/js/components/TopNavSearch.vue';

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