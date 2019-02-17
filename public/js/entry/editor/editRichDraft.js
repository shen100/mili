import '~/styles/main.scss';
import 'iview/dist/styles/iview.css';
import '~/styles/editor/editDraft.scss';
import '~/styles/editor/rich.editor.scss';
import Vue from 'vue';
import App from '~/js/components/editor/EditRichDraft.vue';
import { Modal } from 'iview';
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
