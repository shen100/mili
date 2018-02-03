<template>
    <div>
        <div class="book-box">
            <div class="editor-box-wrap">
                <md-editor :value="htmlContent" :user="user" @save="onContentSave" @change="onContentChage"></md-editor>
            </div>
        </div>
    </div>
</template>

<script>
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
            'md-editor': Editor
        }
    }
</script>

<style>
    @import '../../assets/styles/book/edit.css'
</style>
