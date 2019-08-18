import 'iview/dist/styles/iview.css';
import '~/styles/main.scss';
import '~/styles/codeReview.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import App from '~/js/components/CodeReview.vue';
import {
    Tree,
    Row,
    Col,
} from 'iview';

Vue.component('Tree', Tree);
Vue.component('Row', Row);
Vue.component('Col', Col);

new Vue({
    render: h => h(App),
}).$mount('#app');