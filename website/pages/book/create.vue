<template>
    <div>
        <app-header :user="user" />
        <div class="book-box">
            <div class="editor-box-wrap">
                <md-editor :value="htmlContent" :user="user" @save="onContentSave" @change="onContentChage"></md-editor>
            </div>
        </div>
        <app-footer></app-footer>
    </div>
</template>

<script>
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import Editor from '~/components/Editor'

    export default {
        data () {
        },
        asyncData (context) {
            return {
                htmlContent: ''
            }
        },
        head () {
            return {
                title: '创作图片',
                link: [
                    { rel: 'stylesheet', href: '/styles/editor/simplemde.min.css' }
                ]
            }
        },
        methods: {
            onContentChage () {

            },
            onContentSave () {

            }
        },
        middleware: 'userRequired',
        components: {
            'app-header': Header,
            'app-footer': Footer,
            'md-editor': Editor
        }
    }
</script>

<style>
    @import '../../assets/styles/book/edit.css'
</style>
