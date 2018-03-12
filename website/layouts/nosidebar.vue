<template>
    <div>
        <app-header />
        <div class="common-body" style="margin-bottom: 20px;">
            <nuxt/>
        </div>
        <app-footer />
        <BackTop></BackTop>
    </div>
</template>

<script>
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import config from '~/config'

    export default {
        data () {
            return {
                siteConfig: this.$store.state.siteConfig,
                user: this.$store.state.user,
                userLoginVisible: !this.$store.state.user,
                messages: this.$store.state.messages,
                messageCount: this.$store.state.messageCount
            }
        },
        head () {
            let siteConfig = this.siteConfig
            return {
                titleTemplate: '%s - ' + siteConfig.title,
                meta: [
                    { hid: 'description', name: 'description', content: siteConfig.description },
                    { name: 'keywords', content: siteConfig.keywords }
                ],
                script: [
                    config.allowBaiduAd ? { src: config.baiduAdURL } : null
                ]
            }
        },
        middleware: 'appData',
        components: {
            'app-header': Header,
            'app-footer': Footer
        }
    }
</script>
