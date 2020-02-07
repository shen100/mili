import '~/styles/main.scss';
import '~/styles/signup.css';
import '~/js/common/default.js';
import Vue from 'vue';
import App from '~/js/pages/SignupApp.vue';

new Vue({
    render: h => h(App),
}).$mount('#app');