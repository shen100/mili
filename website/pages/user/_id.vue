<template>
    <div>
        <app-header :user="user" />
        <div class="golang-home-body">
            <div class="golang-main-top">
                <div class="mine-img-box"></div>
                <div class="mine-info-container">
                    <div class="mine-info-icon">
                        <img :src="currentUser.avatarURL" alt="" />
                        <div class="mine-info-upload" v-if="user && user.id === currentUser.id">
                            <img src="~assets/images/camera_fill.png" alt="">
                            <p>修改我的头像</p>
                        </div>
                    </div>
                    <p class="mine-info-line mine-info-name">{{currentUser.name}}</p>
                    <p class="mine-info-line mine-info-desc">
                        暂无个人消息
                    </p>
                    <a class="mine-info-btn">
                        <Button type="primary" size="large">编辑个人资料</Button>  
                    </a>
                </div>    
            </div>
            <div class="golang-mine-content">
                <div class="mine-content-left">
                    <Menu mode="horizontal" theme="light" :active-name="activeMenu" @on-select="onMenuSelect">
                        <Menu-item name="index" class="mine-menu-item">话题</Menu-item>
                        <Menu-item name="reply" class="mine-menu-item">回复</Menu-item>
                        <Menu-item name="3" class="mine-menu-item">参与的投票</Menu-item>
                        <Menu-item name="4" class="mine-menu-item">收藏</Menu-item>
                    </Menu>
                    <nuxt-child/>
                </div>
                <div class="mine-content-right">
                    <div class="mine-attention-box">
                        <div class="attention-item right-border">
                            <p class="attention-item-label">关注了</p>
                            <p class="attention-item-num">0</p>
                        </div>
                        <div class="attention-item">
                            <p class="attention-item-label">关注者</p>
                            <p class="attention-item-num">0</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <app-footer />
    </div>
</template>

<script>
    import ErrorCode from '~/constant/ErrorCode'
    import request from '~/net/request'
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'

    export default {
        data () {
            return {
                activeMenu: 'index'
            }
        },
        validate ({ params }) {
            const id = !!params.id
            return id
        },
        asyncData (context) {
            return request.getPublicUser({
                client: context.req,
                params: {
                    id: context.params.id
                }
            }).then(res => {
                if (res.errNo === ErrorCode.SUCCESS) {
                    return {
                        user: context.user,
                        currentUser: res.data.user
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
                    { rel: 'stylesheet', href: '/styles/editor/simplemde.min.css' }
                ]
            }
        },
        mounted () {
            let route = this.$route.path.split('/')
            if (route[3]) {
                console.log(route[3])
                this.activeMenu = route[3]
            }
        },
        methods: {
            onMenuSelect (name) {
                if (name === 'index') {
                    this.$router.push(`/user/${this.currentUser.id}`)
                } else {
                    this.$router.push(`/user/${this.currentUser.id}/${name}`)
                }
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
    @import '~assets/styles/mine/index.css'
</style>