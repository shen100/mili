<template>
    <div>
        <div v-if="allowBaiduAd" id="bookBannerBox">
            <div id="banner2_760x90"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                allowBaiduAd: this.$store.state.baiduAdConfig.allowBaiduAd,
                banner2_760x90: this.$store.state.baiduAdConfig.banner2_760x90
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
                    window.BAIDU_CLB_fillSlotAsync(this.banner2_760x90, 'banner2_760x90')
                }
            }
        }
    }
</script>
