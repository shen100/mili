import '~/js/common/common.js';
import '~/styles/signup.css';
import Vue from 'vue';
import App from '~/js/components/SignupApp.vue';

new Vue({
    render: h => h(App),
}).$mount('#app');