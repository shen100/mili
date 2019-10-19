import '~/styles/main.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '~/js/pages/recommendations/Layout.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/recommendations/authors/recommended',
        component: () => import('~/js/pages/recommendations/AuthorView.vue')
    }
];

for (let i = 0; i < window.categories.length; i++) {
    routes.push({
        path: `/recommendations/authors/${window.categories[i].pathname}`,
        component: () => import('~/js/pages/recommendations/AuthorView.vue')
    });
}

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