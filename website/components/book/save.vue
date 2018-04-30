<template>
    <div class="book-box">
        <div class="book-main">
            <div class="editor-box-wrap">
                <div class="book-area">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleInline" :label-width="80">
                        <Form-item label="图书名称" prop="bookName">
                            <Input v-model="formValidate.bookName" placeholder="请输入图书名称" style="width: 400px"></Input>
                        </Form-item>
                        <Form-item label="选择分类" prop="selectedCategory">
                            <Select v-model="formValidate.selectedCategory" style="width: 400px">
                                <Option :key="item.id" v-for="item in formValidate.categories" :value="item.id + ''">{{item.name}}</Option>
                            </Select>
                        </Form-item>
                        <Form-item label="封面图片" prop="bookPic">
                            <div class="book-img" :style="{width: (imgWidth + 2) + 'px', height: (imgHeight + 2) + 'px'}">
                                <img :src="coverURL">
                            </div>
                            <Upload
                                action=""
                                accept="image/*"
                                :show-upload-list="false"
                                :before-upload="beforeUpload" :name="'upFile'" :format="['jpg', 'jpeg', 'png']"
                                :on-format-error="onFormatError">
                                <Button type="ghost" icon="ios-cloud-upload-outline">上传封面图片</Button>
                            </Upload>
                            <Modal v-model="uploaderVisible" width="400">
                                <div slot="header" style="color:#f60;text-align:center">
                                    <p id="uploader-pop-title">编辑封面图片</p>
                                    <p id="uploader-pop-subheading">调整尺寸和位置</p>
                                </div>
                                <div id="avatarUploader"></div>
                                <div slot="footer">
                                    <Button type="primary" long @click="onUpload">保存</Button>
                                </div>
                            </Modal>
                        </Form-item>
                        <Form-item label="阅读权限" prop="readLimits">
                            <RadioGroup v-if="isMounted" v-model="formValidate.readLimits">
                                <Radio label="公开"></Radio>
                                <Radio v-if="allowReadLimitsPrivate" label="私有"></Radio>
                            </RadioGroup>
                        </Form-item>
                        <Form-item v-if="allowSelectContentType" label="图书格式" prop="contentType">
                            <div v-if="!bookID">
                                <RadioGroup v-if="isMounted" v-model="formValidate.contentType">
                                    <Radio label="markdown"></Radio>
                                    <Radio label="html"></Radio>
                                </RadioGroup>
                            </div>
                            <div v-else>{{formValidate.contentType}}</div>
                        </Form-item>
                        <Form-item label="图书简介" prop="content">
                            <div v-show="formValidate.contentType === 'html'" class="chapter-html-editor">
                                <html-editor :value="formValidate.content" :user="user" @save="onContentSave" @change="onContentChange" />
                            </div>
                            <md-editor v-show="formValidate.contentType === 'markdown'" :value="formValidate.content" :user="user" @save="onContentSave" @change="onContentChange"></md-editor>
                        </Form-item>
                        <Form-item :label-width="0">
                            <Button size="large" v-if="isMounted" type="primary" @click="onSubmit">{{bookID ? '下一步' : '下一步'}}</Button>
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
    import UserRole from '~/constant/UserRole'
    import Editor from '~/components/Editor'
    import HTMLEditor from '~/components/HTMLEditor'
    import request from '~/net/request'
    import config from '~/config'

    export default {
        props: [
            'book',
            'categories',
            'user'
        ],
        data () {
            let allowReadLimitsPrivate = false
            let allowSelectContentType = false
            let roles = [
                UserRole.USER_ROLE_EDITOR,
                UserRole.USER_ROLE_ADMIN,
                UserRole.USER_ROLE_SUPER_ADMIN,
                UserRole.USER_ROLE_CRAWLER_ADMIN
            ]
            if (roles.indexOf(this.user.role) >= 0) {
                allowReadLimitsPrivate = true
                allowSelectContentType = true
            }
            let readLimits = '公开'
            let contentType = 'markdown'
            let content = ''
            if (this.book) {
                if (this.book.contentType === 2) {
                    contentType = 'html'
                    content = this.book.htmlContent
                } else if (this.book.contentType === 1) {
                    contentType = 'markdown'
                    content = this.book.content
                }
                if (this.book.readLimits === 'book_read_limits_public') {
                    readLimits = '公开'
                } else if (this.book.readLimits === 'book_read_limits_private') {
                    readLimits = '私有'
                }
            }
            return {
                isMounted: false,
                allowReadLimitsPrivate: allowReadLimitsPrivate,
                allowSelectContentType: allowSelectContentType,
                bookID: (this.book && this.book.id) || undefined,
                coverURL: (this.book && this.book.coverURL) || '',
                uploadURL: config.uploadURL,
                file: null,
                uploaderVisible: false,
                croppie: null,
                imgWidth: 188,
                imgHeight: 238,
                formValidate: {
                    bookName: (this.book && this.book.name) || '',
                    selectedCategory: (this.book && this.book.categories && this.book.categories.length && this.book.categories[0].id + '') || '',
                    categories: this.categories,
                    contentType: contentType,
                    readLimits: readLimits,
                    content: content || ''
                },
                ruleInline: {
                    bookName: [
                        { required: true, message: '请输入图书名称', trigger: 'blur' }
                    ],
                    selectedCategory: [
                        { required: true, message: '请选择分类', trigger: 'change' }
                    ],
                    readLimits: [
                        { required: true, message: '' }
                    ],
                    contentType: [
                        { required: true, message: '' }
                    ],
                    content: [
                        { required: true, message: '请输入图书简介', trigger: 'blur' }
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
                                width: self.imgWidth + 80,
                                height: self.imgHeight + 80
                            },
                            viewport: {
                                width: self.imgWidth,
                                height: self.imgHeight,
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
            onContentChange (content) {
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
                        let type
                        let reqData = {
                            id: this.bookID,
                            name: this.formValidate.bookName,
                            categories: [
                                {
                                    id: parseInt(this.formValidate.selectedCategory)
                                }
                            ],
                            coverURL: this.coverURL
                        }
                        if (this.formValidate.readLimits === '公开') {
                            reqData.readLimits = 'book_read_limits_public'
                        } else if (this.formValidate.readLimits === '私有') {
                            reqData.readLimits = 'book_read_limits_private'
                        }
                        if (this.formValidate.contentType === 'html') {
                            type = 2
                            reqData.htmlContent = this.formValidate.content
                        } else if (this.formValidate.contentType === 'markdown') {
                            type = 1
                            reqData.content = this.formValidate.content
                        }
                        reqData.contentType = type
                        func({
                            body: reqData
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
                                let bookID = res.data.book.id
                                setTimeout(function () {
                                    location.href = `/book/edit/chapter/${bookID}`
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
            'md-editor': Editor,
            'html-editor': HTMLEditor
        }
    }
</script>
