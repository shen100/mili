<template>
    <div>
        <app-header :user="user" />
        <div class="golang-home-body">
            <div class="golang-main-top">
                <div class="mine-img-box" :style="{'background-image': 'url(' + currentUser.coverURL + ')'}"></div>
                <div class="mine-info-container">
                    <div class="mine-info-icon">
                        <img :src="avatarURL" alt="" />
                        <div v-if="isAuthor" class="mine-info-upload">
                            <Upload style="width:160px; height: 160px;"
                                ref="upload"
                                action=""
                                accept="image/*"
                                :show-upload-list="false"
                                :format="['jpg','jpeg','png']"
                                :on-format-error="onFormatError"
                                :before-upload="beforeUpload">
                                <Icon class="mine-info-upload-icon" type="camera"></Icon>
                                <p>修改我的头像</p>
                            </Upload>
                        </div>
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
                    </div>
                    <p class="mine-info-line mine-info-name">{{currentUser.name}}</p>
                    <p class="mine-info-line mine-info-item">
                        <span class="mine-info-value" :class="currentUser.sex == 1 ? 'women' : 'male'"><Icon type="male"></Icon>{{currentUser.sex == 1 ? '女' : '男'}}</span>
                    </p>
                    <p class="mine-info-line mine-info-item">
                        <span class="mine-info-desc text-italic">{{currentUser.signature ? currentUser.signature : '这家伙很懒，什么个性签名都没有留下'}}</span>
                    </p>
                    <a class="mine-info-btn" v-if="user && currentUser.id === user.id" href="/user/edit">
                        <button class="ivu-btn-large info-button">编辑个人资料</button>
                    </a>
                </div>
            </div>
            <div class="golang-mine-content">
                <div class="mine-content-left">
                    <ul class="mine-menu-list">
                        <li class="mine-menu-item" style="padding-left: 0;"><a :class="{'mine-menu-item-active': isUserTopicMenu}" :href="`/user/${currentUser.id}`">话题<span class="mine-menu-meta">{{currentUser.articleCount}}</span></a></li>
                        <li class="mine-menu-item"><a :class="{'mine-menu-item-active': isUserReplyMenu}" :href="`/user/${currentUser.id}/reply`">回复<span class="mine-menu-meta">{{currentUser.commentCount}}</span></a></li>
                        <li class="mine-menu-item"><a :class="{'mine-menu-item-active': isUserVoteMenu}" :href="`/user/${currentUser.id}/vote`">参与的投票<span></span></a></li>
                        <li class="mine-menu-item"><a :class="{'mine-menu-item-active': isUserCollectMenu}" :href="`/user/${currentUser.id}/collect`">收藏<span class="mine-menu-meta"></span></a></li>
                    </ul>
                    <nuxt-child/>
                </div>
                <div class="mine-content-right">
                    <div class="mine-attention-box">
                        <div class="attention-item right-border">
                            <a id="topicCountBox" :href="`/user/${currentUser.id}`" style="display:block;">
                                <p class="attention-item-label">话题数</p>
                                <p class="attention-item-num" style="margin-bottom:0;">{{currentUser.articleCount}}</p>
                            </a>
                        </div>
                        <div class="attention-item">
                            <a id="replyCountBox" :href="`/user/${currentUser.id}/reply`" style="display:block;">
                                <p class="attention-item-label">回复数</p>
                                <p class="attention-item-num" style="margin-bottom:0;">{{currentUser.commentCount}}</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <app-footer />
    </div>
</template>

<script>
    import axios from 'axios'
    import url from 'url'
    import ErrorCode from '~/constant/ErrorCode'
    import request from '~/net/request'
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import config from '~/config'

    export default {
        name: 'userHome',
        data () {
            return {
                activeMenu: 'index',
                uploaderVisible: false,
                uploadURL: config.apiURL + '/user/updateavatar',
                croppie: null,
                file: null,
                sizeLimit: 3 * 1024 * 1024,
                sizeLimitTip: '3M'
            }
        },
        validate ({ params }) {
            const hasId = !!params.id
            return hasId
        },
        asyncData (context) {
            let myURL = url.parse(context.req.url, true)
            let pathname = myURL.pathname
            let isUserTopicMenu = false
            let isUserReplyMenu = false
            let isUserVoteMenu = false
            let isUserCollectMenu = false
            if (pathname.match(/^\/user\/[0-9]+$/)) {
                isUserTopicMenu = true
            } else if (pathname.match(/^\/user\/[0-9]+\/reply$/)) {
                isUserReplyMenu = true
            } else if (pathname.match(/^\/user\/[0-9]+\/vote$/)) {
                isUserVoteMenu = true
            } else if (pathname.match(/^\/user\/[0-9]+\/collect$/)) {
                isUserCollectMenu = true
            }
            return request.getPublicUser({
                client: context.req,
                params: {
                    id: context.params.id
                }
            }).then(res => {
                if (res.errNo === ErrorCode.SUCCESS) {
                    let currentUser = res.data.user
                    return {
                        isUserTopicMenu: isUserTopicMenu,
                        isUserReplyMenu: isUserReplyMenu,
                        isUserVoteMenu: isUserVoteMenu,
                        isUserCollectMenu: isUserCollectMenu,
                        isAuthor: context.user && context.user.id === currentUser.id,
                        user: context.user, // 当前登录用户
                        currentUser: currentUser, // 作者
                        avatarURL: currentUser.avatarURL
                    }
                } else {
                    context.error({ statusCode: 404, message: 'Page not found' })
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        head () {
            return {
                title: this.currentUser.name,
                link: [
                    { rel: 'stylesheet', href: '/styles/editor/simplemde.min.css' },
                    { rel: 'stylesheet', href: '/styles/croppie/croppie.min.css' }
                ],
                script: [
                    { src: '/javascripts/croppie/croppie.min.js' }
                ]
            }
        },
        mounted () {
            let route = this.$route.path.split('/')
            if (route[3]) {
                this.activeMenu = route[3]
            }
        },
        methods: {
            onFormatError () {
                this.$Message.error('不是有效的图片格式')
            },
            beforeUpload (file) {
                let self = this
                this.file = file
                if (file.size > this.sizeLimit) {
                    this.$Message.error('图片大小要小于' + this.sizeLimitTip)
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
                            self.avatarURL = result.data.url
                            self.currentUser.avatarURL = result.data.url
                            if (self.isAuthor) {
                                self.user.avatarURL = result.data.url
                            }
                            self.uploaderVisible = false
                        } else {
                            self.$Message.error(result.msg)
                        }
                    })
                })
            }
        },
        middleware: 'userInfo',
        components: {
            'app-header': Header,
            'app-footer': Footer
        }
    }
</script>

<style>
    @import '../../assets/styles/mine/index.css'
</style>
