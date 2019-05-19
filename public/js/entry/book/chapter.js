import 'iview/dist/styles/iview.css';
import '~/styles/main.scss';
import '~/styles/article/articleDisplay.scss';
import '~/styles/book/chapter.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import {
    Tree,
} from 'iview';
import Chapter from '~/js/pages/book/Chapter.vue';

Vue.component('Tree', Tree);

new Vue({
    render: h => h(Chapter),
}).$mount('#chapterBox');
