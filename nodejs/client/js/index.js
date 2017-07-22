import Vue 		 from 'vue';
import VueRouter from 'vue-router';
import iView     from 'iView';
import axios     from 'axios';
import 'iview/dist/styles/iview.css';

import App		 	from './Index/App';
import TagManage 	from './Index/TagManage';
import ArticleEdit  from './Index/ArticleEdit';

const routes = [
	{
		path: '/tag/manage',
		component: TagManage
	},
	{
		path: '/article/edit',
		component: ArticleEdit
	}
];

Vue.use(VueRouter);
Vue.use(iView);
Vue.prototype.$http = axios;

const router = new VueRouter({
	routes
})

new Vue({
	el: '#app',
	router,
	render: h => h(App)
})