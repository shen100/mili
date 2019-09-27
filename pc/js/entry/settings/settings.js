import 'iview/dist/styles/iview.css';
import '~/styles/main.scss';
import '~/styles/settings/settings.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '~/js/pages/settings/Layout.vue';

import {
    registerDirective,
} from '~/js/utils/vue.js';

registerDirective(Vue);

Vue.use(VueRouter);

const routes = [
    { path: '/settings/profile', component: () => import('~/js/pages/settings/ProfileView.vue') },
    { path: '/settings/password', component: () => import('~/js/pages/settings/PasswordView.vue') },
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

const app = new Vue({
    router,
    render: h => h(Layout),
}).$mount('#mainBox');