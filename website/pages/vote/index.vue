<template>
    <div>
        <app-header :user="user" />

        <app-footer />
    </div>
</template>

<script>
    import Vue from 'vue'
    import iview from 'iview'
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    // import request from '~/net/request'

    Vue.use(iview)

    export default {
        data () {
            return {

            }
        },
        asyncData (context) {
            return {
                user: context.user
            }
        },
        head () {
            return {
                title: '投票'
            }
        },
        middleware: 'userInfo',
        mounted () {

        },
        filters: {

        },
        components: {
            'app-header': Header,
            'app-footer': Footer
        }
    }
</script>

<style>

</style>
