import '~/styles/main.scss';
import '~/styles/search/search.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import All from '~/js/pages/search/All.vue';

new Vue({
    render: h => h(All),
}).$mount('#result-list');
