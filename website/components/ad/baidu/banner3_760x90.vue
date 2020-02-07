<template>
    <div>
        <div v-if="allowBaiduAd" class="bookBannerBox">
            <div id="banner3_760x90" class="banner760x90"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                allowBaiduAd: this.$store.state.baiduAdConfig.allowBaiduAd,
                banner3_760x90: this.$store.state.baiduAdConfig.banner3_760x90
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
                    window.BAIDU_CLB_fillSlotAsync(this.banner3_760x90, 'banner3_760x90')
                }
            }
        }
    }
</script>
