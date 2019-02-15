import '~/styles/main.scss';
import '~/styles/editor/editDraft.scss';
import '~/styles/editor/markdown.editor.scss';
import Vue from 'vue';
import App from '~/js/components/editor/EditMarkdownDraft.vue';

new Vue({
    render: h => h(App),
}).$mount('#app');

if (module.hot) {
    module.hot.accept();
}
