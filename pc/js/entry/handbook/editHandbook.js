import 'iview/dist/styles/iview.css';
import '~/styles/main.scss';
import '~/styles/editor/editDraft.scss';
import '~/styles/editor/md.editor.scss';
import '~/styles/handbook/editHandbook.scss';

import Vue from 'vue';
import VueRouter from 'vue-router';
import {
    Modal,
    Select,
    Option,
    Spin,
    DatePicker,
    InputNumber,
} from 'iview';
import App from '~/js/pages/handbook/EditHandbookLayout.vue';

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

Vue.use(VueRouter);

const routes = [
    { path: `/handbooks/new`, component: () => import('~/js/pages/handbook/CreateHandBookView.vue') },
    { path: `/handbooks/:handbookID/chapters/:chapterID/edit`, component: () => import('~/js/pages/handbook/EditHandBookView.vue') },
];

const router = new VueRouter({
    routes,
    mode: 'history',
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
        }
    }
});

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');

if (module.hot) {
    module.hot.accept();
}
