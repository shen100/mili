import '~/styles/main.scss';
import Vue from 'vue';
import '~/js/common/default.js';
import App from '~/js/pages/editor/Published.vue';

import {
    Modal,
} from 'iview';

Vue.component('Modal', Modal);

new Vue({
    render: h => h(App),
}).$mount('#app');

if (module.hot) {
    module.hot.accept();
}
