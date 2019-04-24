import '~/styles/main.scss';
import '~/styles/search/search.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import User from '~/js/pages/search/User.vue';

new Vue({
    render: h => h(User),
}).$mount('#search-view');
