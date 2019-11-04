import '~/styles/main.scss';
import '~/styles/article/articleDisplay.scss';
import '~/styles/book/chapter.scss';
import '~/styles/comment/commentDisplay.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import VueRouter from 'vue-router';
import ChapterLayout from '~/js/pages/book/ChapterLayout.vue';

Vue.use(VueRouter);

const routes = [
    { path: '/books/:bookID/chapters/:chapterID', component: () => import('~/js/pages/book/Chapter.vue') },
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
    render: h => h(ChapterLayout),
}).$mount('#chapterBox');
