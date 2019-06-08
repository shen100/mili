import '~/styles/main.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import App from '~/js/pages/tag/Tag.vue';

new Vue({
    render: h => h(App),
}).$mount('#container');
