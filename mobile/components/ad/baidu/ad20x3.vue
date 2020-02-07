<template>
    <div>
        <div v-if="allowBaiduAd" id="ad20x3_Box"></div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                allowBaiduAd: this.$store.state.baiduAdConfig.allowBaiduAd,
                ad20x3: this.$store.state.baiduAdConfig.ad20_3
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
                    window.BAIDU_CLB_fillSlotAsync(this.ad20x3, 'ad20x3_Box')
                }
            }
        }
    }
</script>
