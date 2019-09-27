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
    { path: '/uc/:id', component: () => import('~/js/pages/user/ArticleView.vue') },
    { path: '/uc/:id/boilings', component: () => import('~/js/pages/user/BoilingPointView.vue') },
    { path: '/uc/:id/like/articles', component: () => import('~/js/pages/user/LikeArticleView.vue') },
    { path: '/uc/:id/like/boilings', component: () => import('~/js/pages/user/LikeBoilingPointView.vue') },
    { path: '/uc/:id/follows', component: () => import('~/js/pages/user/FollowView.vue') },
    { path: '/uc/:id/followers', component: () => import('~/js/pages/user/FollowerView.vue') },
    { path: '/uc/:id/followtags', component: () => import('~/js/pages/user/FollowTagView.vue') },
    { path: '/uc/:id/handbooks', component: () => import('~/js/pages/user/HandBookView.vue') },
    { path: '/uc/:id/collections', component: () => import('~/js/pages/user/CollectionView.vue') },
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