import 'iview/dist/styles/iview.css';
import '~/styles/main.scss';
import '~/styles/editor/editDraft.scss';
import '~/styles/editor/articleDisplay.scss';
import '~/styles/editor/rich.editor.scss';

import Vue from 'vue';
import App from '~/js/components/editor/EditRichDraft.vue';
import {
    Modal,
    Select,
    Option,
} from 'iview';

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
