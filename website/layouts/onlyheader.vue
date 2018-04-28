<template>
    <div>
        <app-header />
        <div class="common-body" style="margin-bottom: 20px;">
            <nuxt/>
        </div>
        <BackTop></BackTop>
    </div>
</template>

<script>
    import Header from '~/components/Header'
    import config from '~/config'

    export default {
        data () {
            return {
                siteConfig: this.$store.state.siteConfig
            }
        },
        head () {
            let siteConfig = this.siteConfig
            let allowBaiduAd = this.$store.state.baiduAdConfig.allowBaiduAd
            return {
                titleTemplate: '%s - ' + siteConfig.title,
                meta: [
                    { hid: 'description', name: 'description', content: siteConfig.description },
                    { name: 'keywords', content: siteConfig.keywords }
                ],
                script: allowBaiduAd ? [ {src: config.baiduAdURL} ] : []
            }
        },
        middleware: 'appData',
        components: {
            'app-header': Header
        }
    }
</script>
