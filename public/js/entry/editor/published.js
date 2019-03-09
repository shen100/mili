import '~/styles/main.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import App from '~/js/components/editor/Published.vue';

new Vue({
    render: h => h(App),
}).$mount('#app');

if (module.hot) {
    module.hot.accept();
}
