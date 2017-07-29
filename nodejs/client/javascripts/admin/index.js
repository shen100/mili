import Vue 		 from 'vue';
import VueRouter from 'vue-router';
import iView     from 'iView';
import axios     from 'axios';
import 'iview/dist/styles/iview.css';

import App		  	  from './Index/App';
import Admin		  from './Index/Admin';
import ArticleEdit    from './Index/ArticleEdit';
import ArticleList    from './Index/ArticleList';
import CategoryManage from './Index/CategoryManage';
import Signin  		  from './Index/Signin';

const routes = [
	{
		path: '/admin',
		component: Admin,
		children: [
			{
				path: 'category/manage',
				component: CategoryManage
			},
			{
				path: 'article',
				component: ArticleList
			},
			{
				path: 'article/add',
				component: ArticleEdit
			},
			{
				path: 'article/edit/:id',
				component: ArticleEdit
			}
		]
	},
	{
		path: '/admin/signin',
		component: Signin
	}
];

Vue.use(VueRouter);
Vue.use(iView);
Vue.prototype.$http = axios;

const router = new VueRouter({
	//mode: 'history',
	routes
})

new Vue({
	el: '#app',
	router,
	render: h => h(App)
})











