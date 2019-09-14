/**
 * 沸点列表，沸点详情页面都用的这个js
 */
import 'iview/dist/styles/iview.css';
import '~/styles/main.scss';
import '~/styles/boilingpoint/boilingpoint.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import BoilingPoint from '~/js/pages/boilingpoint/BoilingPoint.vue';

import {
    Modal,
    Radio,
    RadioGroup,
} from 'iview';

Vue.component('Modal', Modal);
Vue.component('Radio', Radio);
Vue.component('RadioGroup', RadioGroup);

import {
    registerDirective,
} from '~/js/utils/vue.js';

registerDirective(Vue);

new Vue({
    render: h => h(BoilingPoint),
}).$mount('#centerBox');
