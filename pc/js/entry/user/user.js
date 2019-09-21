import 'iview/dist/styles/iview.css';
import '~/styles/main.scss';
import '~/styles/user/user.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '~/js/pages/user/Layout.vue';

import {
    registerDirective,
} from '~/js/utils/vue.js';

registerDirective(Vue);

Vue.use(VueRouter);

import {
    Modal,
    Radio,
    RadioGroup,
} from 'iview';

Vue.component('Modal', Modal);
Vue.component('Radio', Radio);
Vue.component('RadioGroup', RadioGroup);

const routes = [
    { path: '/users/:id', component: () => import('~/js/pages/user/ArticleView.vue') },
    { path: '/users/:id/articles', component: () => import('~/js/pages/user/ArticleView.vue') },
    { path: '/users/:id/boilings', component: () => import('~/js/pages/user/BoilingPointView.vue') },
    { path: '/users/:id/like/articles', component: () => import('~/js/pages/user/LikeArticleView.vue') },
    { path: '/users/:id/like/boilings', component: () => import('~/js/pages/user/LikeBoilingPointView.vue') },
    { path: '/users/:id/follows', component: () => import('~/js/pages/user/FollowView.vue') },
    { path: '/users/:id/followers', component: () => import('~/js/pages/user/FollowerView.vue') },
    { path: '/users/:id/followtags', component: () => import('~/js/pages/user/FollowTagView.vue') },
    { path: '/users/:id/handbooks', component: () => import('~/js/pages/user/HandBookView.vue') },
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