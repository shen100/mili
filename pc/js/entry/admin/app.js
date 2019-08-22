import 'iview/dist/styles/iview.css';
import '~/styles/admin.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '~/js/pages/admin/layout.vue';

import {
    Icon,
    Menu,
    MenuGroup,
    MenuItem,
    Submenu,
    Table,
} from 'iview';

Vue.component('Icon', Icon);
Vue.component('Menu', Menu);
Vue.component('MenuGroup', MenuGroup);
Vue.component('MenuItem', MenuItem);
Vue.component('Submenu', Submenu);
Vue.component('Table', Table);

Vue.use(VueRouter);

const routes = [
    { path: '/', component: () => import('~/js/pages/admin/index.vue') },
    { path: '/boilingpoint/topic', component: () => import('~/js/pages/admin/boilingpoint/Topic.vue') },
    { path: '*', component: () => import('~/js/pages/admin/404.vue') }
];

const router = new VueRouter({
    routes,
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
        }
    }
});

router.beforeEach((to, from, next) => {
    // 未登录的话，跳转到登录页
    next();
});

const app = new Vue({
    router,
    render: h => h(App),
}).$mount('#app');