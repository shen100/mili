import '~/js/common/common.js';
import '~/styles/signin.css';
import Vue from 'vue';
import App from '~/js/components/SigninApp.vue';

new Vue({
    render: h => h(App),
}).$mount('#app');