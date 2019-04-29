import '~/styles/main.scss';
import '~/styles/search/search.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import All from '~/js/pages/search/All.vue';
import Article from '~/js/pages/search/Article.vue';
import Category from '~/js/pages/search/Category.vue';
import User from '~/js/pages/search/User.vue';

let AppView;

switch (window.searchType) {
    case 'all': {
        AppView = All;
        break;
    }
    case 'article': {
        AppView = Article;
        break;
    }
    case 'category': {
        AppView = Category;
        break;
    }
    case 'user': {
        AppView = User;
        break;
    }
}

new Vue({
    render: h => h(AppView),
}).$mount('#search-view');
