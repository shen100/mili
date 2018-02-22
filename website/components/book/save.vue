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
                        <Form-item label="封面图片" prop="bookPic">
                            <div class="book-img">
                                <img :src="coverURL">
                            </div>
                            <Upload
                                action=""
                                accept="image/*"
                                :show-upload-list="false"
                                :before-upload="beforeUpload" :name="'upFile'" :format="['jpg', 'jpeg', 'png', 'gif']"
                                :on-format-error="onFormatError">
                                <Button type="ghost" icon="ios-cloud-upload-outline">上传封面图片</Button>
                            </Upload>
                            <Modal v-model="uploaderVisible" width="400">
                                <div slot="header" style="color:#f60;text-align:center">
                                    <p id="uploader-pop-title">编辑头像</p>
                                    <p id="uploader-pop-subheading">调整头像尺寸和位置</p>
                                </div>
                                <div id="avatarUploader"></div>
                                <div slot="footer">
                                    <Button type="primary" long @click="onUpload">保存</Button>
                                </div>
                            </Modal>
                        </Form-item>
                        <Form-item label="图书简介" prop="content">
                            <div>
                            <md-editor :value="formValidate.content" :user="user" @save="onContentSave" @change="onContentChage"></md-editor>
                            </div>
                        </Form-item>
                        <Form-item class="topic-submit" :label-width="0">
                            <Button size="large" v-if="isMounted" type="primary" @click="onSubmit">{{bookID ? '保存图书' : '创建图书'}}</Button>
                        </Form-item>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import ErrorCode from '~/constant/ErrorCode'
    import Editor from '~/components/Editor'
    import request from '~/net/request'
    import config from '~/config'

    export default {
        props: [
            'book',
            'user'
        ],
        data () {
            return {
                isMounted: false,
                bookID: this.book && this.book.id,
                coverURL: this.book && this.book.coverURL,
                uploadURL: config.uploadURL,
                file: null,
                uploaderVisible: false,
                croppie: null,
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
        head () {
            return {
                title: this.bookID ? '编辑图书' : '创建图书',
                link: [
                    { rel: 'stylesheet', href: '/styles/editor/simplemde.min.css' },
                    { rel: 'stylesheet', href: '/styles/croppie/croppie.min.css' }
                ],
                script: [
                    { src: '/javascripts/croppie/croppie.min.js' }
                ]
            }
        },
        methods: {
            onFormatError () {
                this.$Message.error({
                    duration: config.messageDuration,
                    closable: true,
                    content: '不是有效的图片格式'
                })
            },
            beforeUpload (file) {
                let self = this
                this.file = file
                if (file.size > config.sizeLimit) {
                    this.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: '图片大小要小于' + config.sizeLimitTip
                    })
                    return
                }
                this.uploaderVisible = !this.uploaderVisible
                let avatarUploader = document.getElementById('avatarUploader')
                avatarUploader.innerHTML = ''
                this.croppie = null
                var reader = new FileReader()
                reader.addEventListener('load', function () {
                    setTimeout(() => {
                        let opts = {
                            url: reader.result,
                            boundary: {
                                width: 240,
                                height: 240
                            },
                            viewport: {
                                width: 160,
                                height: 160,
                                type: 'square'
                            }
                        }
                        self.croppie = new window.Croppie(avatarUploader, opts)
                    }, 200)
                })
                reader.readAsDataURL(file)
                return false
            },
            onUpload () {
                let self = this
                this.croppie && this.croppie.result('blob').then(function (blob) {
                    let form = new FormData()
                    form.append('upFile', blob, self.file.name)
                    let config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                    axios.post(self.uploadURL, form, config).then(res => {
                        let result = res.data
                        if (result.errNo === ErrorCode.SUCCESS) {
                            self.coverURL = result.data.url
                            self.uploaderVisible = false
                        } else {
                            self.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: result.msg
                            })
                        }
                    })
                })
            },
            onContentChage (content) {
                this.formValidate.content = content
            },
            onContentSave () {
                this.onSubmit()
            },
            onSubmit () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        let self = this
                        let func = this.bookID ? request.updateBook : request.createBook
                        func({
                            body: {
                                id: this.bookID,
                                name: this.formValidate.bookName,
                                content: this.formValidate.content,
                                coverURL: this.coverURL
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.ERROR) {
                                self.$Message.error({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: res.msg
                                })
                            } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                                location.href = '/signin?ref=' + encodeURIComponent(location.href)
                            } else if (res.errNo === ErrorCode.SUCCESS) {
                                setTimeout(function () {
                                    let userID = self.user.id
                                    location.href = `/user/${userID}/books/`
                                }, 500)
                            }
                        }).catch(err => {
                            self.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: err.message || err.msg
                            })
                        })
                    }
                })
                return false
            }
        },
        components: {
            'md-editor': Editor
        }
    }
</script>

<style>
    @import '../../assets/styles/book/edit.css'
</style>
