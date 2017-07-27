import Vue 		 from 'vue';
import iView     from 'iView';
import axios     from 'axios';
import 'iview/dist/styles/iview.css';

import EditArticle		 from './EditArticle';

Vue.use(iView);
Vue.prototype.$http = axios;

new Vue({
	el: '#app',
	render: h => h(EditArticle)
})











