import 'iview/dist/styles/iview.css';
import '~/styles/main.scss';
import '~/styles/editor/editDraft.scss';
import '~/styles/editor/md.editor.scss';
import '~/styles/handbook/editHandbook.scss';

import Vue from 'vue';
import {
    Modal,
    Select,
    Option,
    Spin,
    DatePicker,
    InputNumber,
} from 'iview';
import App from '~/js/pages/handbook/EditHandBook.vue';

import {
    registerDirective,
} from '~/js/utils/vue.js';

registerDirective(Vue);

Vue.component('Modal', Modal);
Vue.component('Select', Select);
Vue.component('Option', Option);
Vue.component('Spin', Spin);
Vue.component('DatePicker', DatePicker);
Vue.component('InputNumber', InputNumber);

new Vue({
    render: h => h(App),
}).$mount('#app');

if (module.hot) {
    module.hot.accept();
}
