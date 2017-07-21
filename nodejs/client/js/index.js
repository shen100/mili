import Vue 		 from 'vue';
import VueRouter from 'vue-router';
import iView     from 'iView';
import 'iview/dist/styles/iview.css';

import App		 from './Index/App';
import TagManage from './Index/TagManage';

const routes = [
	{
		path: '/tag/manage',
		component: TagManage
	}
];

Vue.use(VueRouter);
Vue.use(iView);

const router = new VueRouter({
	routes
})

new Vue({
	el: '#app',
	router,
	render: h => h(App)
})