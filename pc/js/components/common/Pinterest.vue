<template>
    <div>
        <slot name="content"></slot>
        <slot v-if="isLoading && !isComplete" name="loading"></slot>
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
        'start',
        'query'
    ],
    data () {
        return {
            isLoading: false,
            isComplete: false,
            theOnScroll: null,
            page: this.start || 1,
            queryData: this.query ? { ...this.query } : null,
        };
    },
    mounted () {
        this.theOnScroll = this.onScroll.bind(this);
        window.addEventListener('scroll', this.theOnScroll);
        this.load();
    },
    methods: {
        refresh(query) {
            this.isLoading = false;
            this.isComplete = false;
            this.page = this.start || 1;
            this.queryData = query ? { ...query } : this.queryData;
            this.load();
        },
        load() {
            if (this.isLoading || this.isComplete) {
                return;
            }
            this.isLoading = true;
            let url = this.url + '?page=' + this.page;
            if (this.queryData) {
                for (let key in this.queryData) {
                    if (typeof this.queryData[key] !== 'undefined') {
                        url += ('&' + key + '=' + this.queryData[key]);
                    }
                }
            }
            myHTTP.get(url)
                .then((result) => {
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
                    this.isLoading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.isLoading = false;
                });
        },
        onScroll() {
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
