import 'iview/dist/styles/iview.css';
import '~/styles/main.scss';
import '~/styles/index.css';
import '~/js/common/default.js';
import Vue from 'vue';
import Index from '~/js/pages/Index.vue';

import {
    registerDirective,
} from '~/js/utils/vue.js';

registerDirective(Vue);

new Vue({
    render: h => h(Index),
}).$mount('#articleList');
