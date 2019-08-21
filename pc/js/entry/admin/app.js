import 'iview/dist/styles/iview.css';
import '~/styles/admin.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '~/js/components/admin/app.vue';

Vue.use(VueRouter);
console.log('=-=-=-');
const routes = [
    { path: '/', component: () => import('~/js/components/admin/index.vue') },
    { path: '*', component: () => import('~/js/components/admin/404.vue') }
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