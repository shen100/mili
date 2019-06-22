import '~/styles/main.scss';
import '~/styles/book/books.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import Books from '~/js/pages/book/Books.vue';

new Vue({
    render: h => h(Books),
}).$mount('#books');
