import '~/styles/main.scss';
import '~/styles/search/search.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import Category from '~/js/pages/search/Category.vue';

new Vue({
    render: h => h(Category),
}).$mount('#search-view');
