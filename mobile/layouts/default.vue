<template>
    <div class="nuxt-box">
        <app-header />
        <nuxt ref="content"/>
        <app-tabbar />
    </div>
</template>

<script>
    import config from '~/config'
    import Header from '~/components/Header'
    import Tabbar from '~/components/Tabbar'
    import flexible from '~/utils/flexible'
    import FastClick from '~/utils/fastclick'

    flexible()

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
        mounted () {
            this.$nextTick(function () {
                FastClick.attach(document.body)
            })
        },
        middleware: 'appData',
        components: {
            'app-header': Header,
            'app-tabbar': Tabbar
        }
    }
</script>

