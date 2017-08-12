import Vue 		   from 'vue';
import iView       from 'iView';
import axios       from 'axios';
import EditArticle from './EditArticle.vue';
import '../../styles/article/edit.css'

console.log(12345);

Vue.use(iView);
Vue.prototype.$http = axios;

new Vue({
	el: '#editorBox',
	render: h => h(EditArticle)
});











