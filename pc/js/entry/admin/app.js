import 'iview/dist/styles/iview.css';
import '~/styles/admin.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '~/js/pages/admin/layout.vue';
import { ErrorCode } from '~/js/constants/error.js';
import { myHTTP } from '~/js/common/net.js';

import {
    Avatar,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    Checkbox,
    CheckboxGroup,
    Content,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Form,
    FormItem,
    Icon,
    Input,
    InputNumber,
    Layout,
    Menu,
    MenuGroup,
    MenuItem,
    Message,
    Modal,
    Option,
    Page,
    Radio,
    RadioGroup,
    Row,
    Select,
    Sider,
    Submenu,
    Table,
    TabPane,
    Tabs,
    Tree,
} from 'iview';

Message.config({
    duration: 5
});

Vue.prototype.$Message = Message;

Vue.component('Avatar', Avatar);
Vue.component('Breadcrumb', Breadcrumb);
Vue.component('BreadcrumbItem', BreadcrumbItem);
Vue.component('Button', Button);
Vue.component('Card', Card);
Vue.component('Checkbox', Checkbox);
Vue.component('CheckboxGroup', CheckboxGroup);
Vue.component('Content', Content);
Vue.component('Dropdown', Dropdown);
Vue.component('DropdownItem', DropdownItem);
Vue.component('DropdownMenu', DropdownMenu);
Vue.component('Form', Form);
Vue.component('FormItem', FormItem);
Vue.component('Icon', Icon);
Vue.component('Input', Input);
Vue.component('InputNumber', InputNumber);
Vue.component('Layout', Layout);
Vue.component('Menu', Menu);
Vue.component('MenuGroup', MenuGroup);
Vue.component('MenuItem', MenuItem);
Vue.component('Modal', Modal);
Vue.component('Option', Option);
Vue.component('Page', Page);
Vue.component('Radio', Radio);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Row', Row);
Vue.component('Select', Select);
Vue.component('Sider', Sider);
Vue.component('Submenu', Submenu);
Vue.component('Table', Table);
Vue.component('TabPane', TabPane);
Vue.component('Tabs', Tabs);
Vue.component('Tree', Tree);

Vue.prototype.$Modal = Modal;

Vue.use(VueRouter);

const adminPageURL = window.adminPageURL;

const routes = [
    { path: `/`, component: () => import('~/js/pages/admin/index.vue') },
    { path: `/article/category`, component: () => import('~/js/pages/admin/article/CategoryList.vue') },
    { path: `/article/crawler/list`, component: () => import('~/js/pages/admin/article/CrawlerList.vue') },
    { path: `/article/crawler`, component: () => import('~/js/pages/admin/article/Crawler.vue') },
    { path: `/article/tag`, component: () => import('~/js/pages/admin/article/TagList.vue') },
    { path: `/book/category`, component: () => import('~/js/pages/admin/book/BookCategoryList.vue') },
    { path: `/book/list`, component: () => import('~/js/pages/admin/book/BookList.vue') },
    { path: `/book/:id/edit`, component: () => import('~/js/pages/admin/book/EditBook.vue') },
    { path: `/boilingpoint/topic`, component: () => import('~/js/pages/admin/boilingpoint/Topic.vue') },
    { path: `/exercise/question/list`, component: () => import('~/js/pages/admin/exercise/QuestionList.vue') },
    { path: `/exercise/question/new`, component: () => import('~/js/pages/admin/exercise/EditQuestion.vue') },
    { path: `/exercise/question/:id/edit`, component: () => import('~/js/pages/admin/exercise/EditQuestion.vue') },
    { path: `/*`, component: () => import('~/js/pages/admin/404.vue') }
];

routes.forEach(r => r.path = adminPageURL + r.path);

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

router.beforeEach((to, from, next) => {
    myHTTP.get('/users/logininfo').then((res) => {
        if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
            next();
        } else if (res.data.errorCode === ErrorCode.LoginTimeout.CODE) {
            location.href = '/signin?miliref=' + encodeURIComponent(to.path);
        }
    });
});

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');