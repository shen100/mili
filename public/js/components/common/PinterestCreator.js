import {
    getDocumentSize,
    getWindowSize,
    getScrollPos,
} from '~/js/utils/dom.js';
import {
    myHTTP,
 } from '~/js/common/net.js';

export const create = () => {
    return {
        props: [
            'url',
        ],
        data () {
            return {
                isLoading: false,
                theOnScroll: null,
                list: [],
            };
        },
        mounted () {
            this.theOnScroll = this.onScroll.bind(this);
            window.addEventListener('scroll', this.theOnScroll);
        },
        methods: {
            load () {
                if (this.isLoading) {
                    return;
                }
                this.isLoading = true;
                let url = this.url + '' + this.page;
                myHTTP.get(url)
                    .then((result) => {
                        if (!result) {
                            if (this.theOnScroll) {
                                window.removeEventListener('scroll', this.theOnScroll);
                            }
                            this.loadComplete && this.loadComplete();
                        }
                        this.isLoading = false;
                        this.page++;
                        this.el.append(result);
                    });
            },
            onScroll () {
                const winSize = getWindowSize();
                const docSize = getDocumentSize();
                var height = docSize.height - winSize.height;
                const scrollTop = getScrollPos().scrollTop;
                if (scrollTop >= height * 0.75) {
                    this.load();
                }
            },
        },
        destoryed () {
            this.theOnScroll && window.removeEventListener('scroll', this.theOnScroll);
        },
    };
};
