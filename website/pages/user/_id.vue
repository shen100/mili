<template>
    <div>
        <go-header :userStatus="user" />
        <div class="common-body-box">
            <div class="common-body-main">
                <ul class="common-body-nav">
                    <li><a href="/"><span>主页</span></a></li>
                    <li class="common-body-nav-sep"><span>/</span></li>
                </ul>
                <div class="user-info-box">
                    <p>
                        <img class="golang-user-info-icon" src="~assets/images/head.png" alt="">
                        <span class="user-name">用户名字</span>
                    </p>
                    <p class="user-info-line">积分: 0</p>
                    <p class="user-info-line signup-time">注册于N天前</p>
                </div>
            </div>
            <div class="golang-cell info-box">
                <div class="title">最近创建的话题</div>
                <div class="info-content">
                    <div class="no-content">无话题</div>
                </div>
            </div>
            <div class="golang-cell info-box">
                <div class="title">最近参与的话题</div>
                <div class="info-content">
                    <div class="no-content">无话题</div>
                </div>
            </div>
        </div>
        <go-footer />
    </div>
</template>

<script>
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'

    export default {
        data () {
            return {}
        },
        asyncData (context) {
            return {
                user: context.user
            }
        },
        head () {
            return {
                title: '个人信息'
            }
        },
        middleware: 'userInfo',
        components: {
            'go-header': Header,
            'go-footer': Footer
        }
    }
</script>

<style>
    @import '~assets/styles/user/info.css'
</style>