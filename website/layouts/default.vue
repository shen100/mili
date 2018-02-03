<template>
    <div>
        <app-header :user="user" :messages="messages" :messageCount="messageCount"/>
        <nuxt/>
        <app-sidebar :top10Users="top10Users" :user="user" :userLoginVisible="userLoginVisible" :maxCommentArticles="maxCommentArticles" :pubTopic="true" :maxBrowseArticles="maxBrowseArticles"/>
        <app-footer />
        <BackTop></BackTop>
    </div>
</template>

<script>
    import Header from '~/components/Header2'
    import Footer from '~/components/Footer2'
    import Sidebar from '~/components/Sidebar2'

    export default {
        data () {
            return {
                siteConfig: this.$store.state.siteConfig,
                user: this.$store.state.user,
                userLoginVisible: !this.$store.state.user,
                messages: this.$store.state.messages,
                messageCount: this.$store.state.messageCount,
                top10Users: this.$store.state.top10Users,
                maxCommentArticles: this.$store.state.maxCommentArticles,
                maxBrowseArticles: this.$store.state.maxBrowseArticles
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
            'app-header': Header,
            'app-footer': Footer,
            'app-sidebar': Sidebar
        }
    }
</script>
