<template>
    <div>
        <slot v-if="isLoading && !isComplete" name="loading"></slot>
        <slot v-else name="content"></slot>
    </div>
</template>

<script>
import { ErrorCode } from '~/js/constants/error.js';
import {
    getDocumentSize,
    getWindowSize,
    getScrollPos,
} from '~/js/utils/dom.js';

import {
    myHTTP,
} from '~/js/common/net.js';

export default {
    props: [
        'url',
    ],
    data () {
        return {
            isLoading: false,
            isComplete: false,
            theOnScroll: null,
            page: 1,
        };
    },
    mounted () {
        this.theOnScroll = this.onScroll.bind(this);
        window.addEventListener('scroll', this.theOnScroll);
        this.load();
    },
    methods: {
        load () {
            if (this.isLoading || this.isComplete) {
                return;
            }
            this.isLoading = true;
            let url;
            if (this.url.indexOf('?') < 0) {
                url = this.url + '?page=' + this.page;
            } else {
                url = this.url + '&page=' + this.page;
            }
            myHTTP.get(url)
                .then((result) => {
                    this.isLoading = false;
                    if (result.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        const page = result.data.data.page;
                        const pageSize = result.data.data.pageSize;
                        const count = result.data.data.count;
                        const totalPage = Math.ceil(count / pageSize);
                        if (page >= totalPage) {
                            this.isComplete = true;
                        }
                    }
                    this.page++;
                    this.$emit('load', result);
                })
                .catch((err) => {
                    console.log(err);
                    this.isLoading = false;
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
    destroyed () {
        window.removeEventListener('scroll', this.theOnScroll);
    },
}
</script>
