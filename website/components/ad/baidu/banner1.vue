<template>
    <div>
        <div v-if="allowBaiduAd" id="bannerBox">
            <div id="banner"></div>
            <div id="ad120x90"></div>
        </div>
    </div>
</template>

<script>
    import config from '~/config'

    export default {
        data () {
            return {
                allowBaiduAd: config.allowBaiduAd
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.createAd()
            })
        },
        methods: {
            createAd () {
                if (this.allowBaiduAd) {
                    window.BAIDU_CLB_fillSlotAsync(config.baiduAd.banner1, 'banner')
                    window.BAIDU_CLB_fillSlotAsync(config.baiduAd.ad120x90, 'ad120x90')
                }
            }
        }
    }
</script>
