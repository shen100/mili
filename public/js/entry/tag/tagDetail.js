import '~/styles/main.scss';
import '~/styles/tag/tagDetail.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import TagDetail from '~/js/pages/tag/TagDetail.vue';

new Vue({
    render: h => h(TagDetail),
}).$mount('#tag-entry-list-box');
