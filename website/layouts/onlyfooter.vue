<template>
    <div>
        <nuxt/>
        <app-footer />
    </div>
</template>

<script>
    import Footer from '~/components/Footer'

    export default {
        data () {
            return {
                siteConfig: this.$store.state.siteConfig
            }
        },
        head () {
            let siteConfig = this.siteConfig
            return {
                titleTemplate: '%s - ' + siteConfig.title,
                meta: [
                    { hid: 'description', name: 'description', content: siteConfig.description },
                    { name: 'keywords', content: siteConfig.keywords }
                ]
            }
        },
        middleware: 'appData',
        components: {
            'app-footer': Footer
        }
    }
</script>
