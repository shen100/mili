import '~/styles/signin.css';
import '~/js/common/default.js';
import Vue from 'vue';
import App from '~/js/components/SigninApp.vue';

new Vue({
    render: h => h(App),
}).$mount('#app');