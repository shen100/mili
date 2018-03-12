<template>
    <div>
        <div v-if="allowBaiduAd" id="bookBannerBox">
            <div id="banner"></div>
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
                    window.BAIDU_CLB_fillSlotAsync(config.baiduAd.banner2, 'banner')
                }
            }
        }
    }
</script>
