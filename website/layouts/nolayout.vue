<template>
    <nuxt/>
</template>

<script>
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
        middleware: 'appData'
    }
</script>
