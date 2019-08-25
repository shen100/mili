import 'iview/dist/styles/iview.css';
import '~/styles/main.scss';
import '~/styles/boilingpoint/boilingpoint.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import BoilingPoint from '~/js/pages/boilingpoint/BoilingPoint.vue';

new Vue({
    render: h => h(BoilingPoint),
}).$mount('#centerBox');
