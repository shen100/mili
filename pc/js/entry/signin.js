import '~/styles/main.scss';
import '~/styles/signin.css';
import '~/js/common/default.js';
import Vue from 'vue';
import App from '~/js/pages/SigninApp.vue';

new Vue({
    render: h => h(App),
}).$mount('#app');