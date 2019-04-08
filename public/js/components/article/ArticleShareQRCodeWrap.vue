<template>
    <div>
        <ArticleShareQRCode ref="qrCodePopup" :articleID="articleID"/>
    </div>
</template>

<script>
import ArticleShareQRCode from '~/js/components/article/ArticleShareQRCode.vue';

export default {
    props: [
        'articleID'
    ],
    mounted() {
        const self = this;
        const articleShareWeixinBtn = document.getElementById('articleShareWeixinBtn');
        articleShareWeixinBtn.addEventListener('click', function (event) {
            self.$refs.qrCodePopup.show();
        });
    },
    methods: {
    },
    components: {
        ArticleShareQRCode,
    }
}
</script>
