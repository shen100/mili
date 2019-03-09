import '~/styles/main.scss';
import '~/styles/editor/editDraft.scss';
import Vue from 'vue';
import App from '~/js/components/editor/EditRichDraft.vue';

new Vue({
    render: h => h(App),
}).$mount('#app');

if (module.hot) {
    module.hot.accept();
}
