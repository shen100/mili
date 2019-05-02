import '~/styles/main.scss';
import '~/styles/index.css';
import '~/js/common/default.js';
import Vue from 'vue';
import Index from '~/js/pages/Index.vue';

new Vue({
    render: h => h(Index),
}).$mount('#articleList');
