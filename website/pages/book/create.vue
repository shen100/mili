<template>
    <div class="book-box">
        <div class="book-main">
            <ul class="book-nav">
                <li><a href="/"><span>主页</span></a></li>
                <li class="book-nav-sep"><span>/</span></li>
                <li><span class="book-label">创建图书</span></li>
            </ul>
            <div class="editor-box-wrap">
                <div class="book-area">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleInline" :label-width="80">
                        <Form-item label="图书名称" prop="bookName">
                            <Input v-model="formValidate.bookName" placeholder="请输入图书名称" style="width: 400px"></Input>
                        </Form-item>
                        <!--<Form-item label="封面图片" prop="bookPic">
                            <Upload :before-upload="beforeUpload" :name="'upFile'" :format="['jpg', 'jpeg', 'png', 'gif']"
                                :action="uploadURL">
                                <Button type="ghost" icon="ios-cloud-upload-outline">上传封面图片</Button>
                            </Upload>
                        </Form-item> -->

                        <Form-item class="book-content" :label-width="0" prop="content">
                            <md-editor :value="formValidate.content" :user="user" @save="onContentSave" @change="onContentChage"></md-editor>
                        </Form-item>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Editor from '~/components/Editor'
    import config from '~/config'

    export default {
        data () {
            return {
                isMounted: false,
                uploadURL: config.apiURL + '/upload',
                formValidate: {
                    bookName: (this.book && this.book.name) || '',
                    content: (this.book && (this.book.content || this.book.htmlContent)) || ''
                },
                ruleInline: {
                    bookName: [
                        { required: true, message: '请输入图书名称', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '请输入内容简介', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted () {
            this.isMounted = true
        },
        asyncData (context) {
            return {
                htmlContent: '',
                user: context.user
            }
        },
        head () {
            return {
                title: '创作图书',
                link: [
                    { rel: 'stylesheet', href: '/styles/editor/simplemde.min.css' }
                ]
            }
        },
        methods: {
            beforeUpload () {

            },
            onContentChage (content) {
                this.formValidate.content = content
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
