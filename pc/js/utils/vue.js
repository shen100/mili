export const registerDirective = (Vue) => {
    if (!Vue.directive('clickoutside')) {
        Vue.directive('clickoutside', {
            bind (el, binding, vnode) {
                function documentHandler (event) {
                    if (el.contains(event.target)) {
                        return false;
                    }
                    if (binding.expression) {
                        binding.value(event, el.dataset);
                    }
                }
                el.__vueClickOutside__ = documentHandler;
                document.addEventListener('click', documentHandler);
            },
            unbind (el, binding) {
                document.removeEventListener('click', el.__vueClickOutside__);
                delete el.__vueClickOutside__;
            },
        });
    }

    if (!Vue.directive('highlight')) {
        Vue.directive('highlight', (el) => {
            const blocks = el.querySelectorAll('pre code');
            blocks.forEach((block) => {
                hljs.highlightBlock(block);
            });
        });
    }
};
