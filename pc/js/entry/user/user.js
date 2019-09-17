import 'iview/dist/styles/iview.css';
import '~/styles/main.scss';
import '~/styles/user/user.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import UserCenter from '~/js/pages/user/UserCenter.vue';

new Vue({
    render: h => h(UserCenter),
}).$mount('#mainBox');