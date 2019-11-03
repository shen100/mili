/**
 * 沸点详情，此文件和 boilingpoint.js 一样，唯一的区别是增加了
 * boilingpointDetail.scss 这个样式文件
 */
import 'iview/dist/styles/iview.css';
import '~/styles/main.scss';
import '~/styles/boilingpoint/boilingpoint.scss';
import '~/styles/boilingpoint/boilingpointDetail.scss';
import '~/styles/comment/commentDisplay.scss';
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
    render: h => h(BoilingPoint, {
        props: {
            url: `/boilingpoints/${window.boilingPointType}`,
            topicID: window.topicID,
            userID: window.user && window.user.id || undefined,
            user: window.user, // 当前登录用户
            boilingPoint: window.boilingPoint,
            commentsVisible: window.commentsVisible,
        }   
    }),
}).$mount('#centerBox');
