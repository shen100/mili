import '~/styles/main.scss';
import '~/styles/editor/editDraft.scss';
import '~/styles/editor/rich.editor.scss';

import Vue from 'vue';
import {
    Modal,
    Select,
    Option,
} from 'iview';
import App from '~/js/pages/editor/EditRichDraft.vue';

import {
    registerDirective,
} from '~/js/utils/vue.js';

registerDirective(Vue);

Vue.component('Modal', Modal);
Vue.component('Select', Select);
Vue.component('Option', Option);

new Vue({
    render: h => h(App),
}).$mount('#app');

if (module.hot) {
    module.hot.accept();
}
