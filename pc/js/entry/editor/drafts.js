import '~/styles/main.scss';
import '~/styles/editor/drafts.scss';
import Vue from 'vue';
import {
    Modal,
} from 'iview';
import App from '~/js/pages/editor/Drafts.vue';

import {
    registerDirective,
} from '~/js/utils/vue.js';

registerDirective(Vue);

Vue.component('Modal', Modal);

new Vue({
    render: h => h(App),
}).$mount('#app');

if (module.hot) {
    module.hot.accept();
}
