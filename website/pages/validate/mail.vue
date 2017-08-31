<template>
    <div>
        <div class="signup-head">
            <div class="signup-head-content">
                <a href="/">
                    <img src="~assets/images/logo.png" alt="">
                    <span>Golang123</span>
                </a>
            </div>
        </div>
        <div class="signup-box">
            <div class="signup-nav">
                <span class="title">Golang123账号注册</span>
                <span class="desc">如果您有Golang123账号，则可以<a href="/signin">登录</a></span>
            </div>
            <div class="signup-message-box" style="height: 500px">
                <div>
                    <div class="message-mail-icon"><img src="~assets/images/mail.png" alt=""></div>
                    <div class="message-mail-right">
                        <p class="signup-reminder-text">我们发送了一封验证邮件到<span class="signup-resend">{{user.email}}</span></p>
                        <p class="signup-reminder-text">请到您的邮箱收信，并点击其中的链接验证您的邮箱</p>
                        <a :href="`http://mail.${user.email.split('@')[user.email.split('@').length - 1]}`" target="_blank"><i-button type="primary">去邮箱验证</i-button></a>
                        <p class="signup-reminder-text signup-text-bottom">收不到邮件？</p>
                        <p class="signup-reminder-small">请检查您的垃圾邮箱或广告箱，邮件有可能被认为垃圾或广告邮件</p>
                        <p class="signup-reminder-small signup-resend click-mouse">重新发送</p>
                    </div>
                </div>
            </div>
        </div>
        <app-footer />
    </div>
</template>

<script>
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
        middleware: 'userRequired',
        head () {
            return {
                title: '邮箱验证'
            }
        },
        components: {
            'app-footer': Footer
        }
    }
</script>

<style>
    @import '~assets/styles/signup.css'
</style>