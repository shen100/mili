<template>
    <div>
        <app-header :user="user" />

        <app-footer></app-footer>
    </div>
</template>

<script>
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'

    export default {
        data () {
        },
        asyncData (context) {
            return {
                user: context.user
            }
        },
        head () {
            return {
                title: '创建投票',
                link: [
                    { rel: 'stylesheet', href: '/styles/editor/simplemde.min.css' }
                ]
            }
        },
        methods: {
        },
        middleware: 'userRequired',
        components: {
            'app-header': Header,
            'app-footer': Footer
        }
    }
</script>

<style>

</style>
