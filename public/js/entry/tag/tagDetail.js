import '~/styles/main.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import TagDetail from '~/js/pages/tag/TagDetail.vue';

new Vue({
    render: h => h(TagDetail),
}).$mount('#container');
