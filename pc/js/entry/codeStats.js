import 'iview/dist/styles/iview.css';
import '~/styles/main.scss';
import '~/styles/codeStats.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import App from '~/js/pages/CodeStats.vue';
import {
    Tree,
    Row,
    Col,
    RadioGroup,
    Radio,
} from 'iview';

Vue.component('Tree', Tree);
Vue.component('Row', Row);
Vue.component('Col', Col);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Radio', Radio);

new Vue({
    render: h => h(App),
}).$mount('#app');