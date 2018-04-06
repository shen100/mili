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
                <span class="title">邮箱验证</span>
                <span class="desc">如果您已经完成验证，那么可以<a href="/signin">登录</a></span>
            </div>
            <div class="signup-message-box" style="height: 500px">
                <div>
                    <div class="message-mail-icon"><img src="~assets/images/mail.png" alt=""></div>
                    <div class="message-mail-right">
                        <p class="signup-reminder-text">我们发送了一封验证邮件到<span class="signup-resend">{{email}}</span></p>
                        <p class="signup-reminder-text">请到您的邮箱收信，并点击其中的链接验证您的邮箱</p>
                        <a :href="`http://mail.${email.split('@')[email.split('@').length - 1]}`" target="_blank"><i-button type="primary">去邮箱验证</i-button></a>
                        <p class="signup-reminder-text signup-text-bottom">收不到邮件？</p>
                        <p class="signup-reminder-small">请查看您的垃圾邮件和广告邮件，邮件有可能会被误认为是垃圾邮件或广告邮件</p>
                        <p class="signup-reminder-small signup-resend click-mouse">重新发送</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ErrorCode from '~/constant/ErrorCode'
    import request from '~/net/request'

    export default {
        data () {
            return {
                email: ''
            }
        },
        asyncData (context) {
            const query = context.query || {}
            if (!query.e) {
                return context.error({ message: 'Not Found', statusCode: 404 })
            }
            return request.sendmail({
                client: context.req,
                body: {
                    email: decodeURIComponent(query.e)
                }
            }).then(res => {
                console.log(res)
                if (res.errNo === ErrorCode.SUCCESS) {
                    return {
                        email: res.data.email
                    }
                } else {
                    return context.error({ message: 'Not Found', statusCode: 404 })
                }
            }).catch(err => {
                console.log(err)
                context.error({ message: 'Not Found', statusCode: 404 })
            })
        },
        layout: 'onlyfooter',
        head () {
            return {
                title: '邮箱验证'
            }
        }
    }
</script>

<style>
    @import '../../assets/styles/signup.css'
</style>
