import '~/styles/main.scss';
import '~/styles/messages.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '~/js/pages/Messages.vue';
import Chat from '~/js/components/messages/Chat.vue';
import Comment from '~/js/components/messages/Comment.vue';
import Follow from '~/js/components/messages/Follow.vue';
import Like from '~/js/components/messages/Like.vue';
import Money from '~/js/components/messages/Money.vue';
import Other from '~/js/components/messages/Other.vue';
import PostArticle from '~/js/components/messages/PostArticle.vue';

Vue.use(VueRouter);

const routes = [
    { path: '/chat', component: Chat, },
    { path: '/comment', component: Comment, },
    { path: '/follow', component: Follow, },
    { path: '/like', component: Like, },
    { path: '/money', component: Money, },
    { path: '/other', component: Other, },
    { path: '/post', component: PostArticle, },
];

const router = new VueRouter({
    routes,
});

new Vue({
    render: h => h(App),
    router,
}).$mount('#app');
