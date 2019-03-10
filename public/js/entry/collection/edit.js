import '~/styles/main.scss';
import '~/js/common/default.js';
import Vue from 'vue';
import App from '~/js/components/collection/edit.vue';
import 'iview/dist/styles/iview.css';
import { Upload } from 'iview';

Vue.component('Upload', Upload);

new Vue({
    render: h => h(App),
}).$mount('#app');