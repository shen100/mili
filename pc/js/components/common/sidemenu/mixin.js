import CommonIcon from './CommonIcon.vue';
import { showTitle } from './util.js';

export default {
    components: {
        CommonIcon
    },
    methods: {
        showTitle (item) {
            return showTitle(item, this);
        },
        showChildren (item) {
            return item.children && (item.children.length > 1 || (item.meta && item.meta.showAlways));
        },
        getNameOrHref (item, children0) {
            return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name);
        }
    }
}
