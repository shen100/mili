import '~/styles/main.scss';
import '~/styles/article/articleDisplay.scss';
import '~/styles/book/chapter.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import Chapter from '~/js/pages/book/Chapter.vue';

new Vue({
    render: h => h(Chapter),
}).$mount('#chapterBox');
