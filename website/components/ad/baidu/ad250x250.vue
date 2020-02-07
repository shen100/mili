<template>
    <div>
        <div v-if="allowBaiduAd" id="ad250x250Box"></div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                allowBaiduAd: this.$store.state.baiduAdConfig.allowBaiduAd,
                ad250x250: this.$store.state.baiduAdConfig.ad250x250
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
                    window.BAIDU_CLB_fillSlotAsync(this.ad250x250, 'ad250x250Box')
                }
            }
        }
    }
</script>
