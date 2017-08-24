<template>
	<div>
        <go-header :userStatus="user" />
        <div class="golang-forget-container">
            <h1>账号中心</h1>
            <p class="golang-forget-title">账号激活</p>
            <div id="reset" class="golang-forget-form">
                <div v-if="success" class="signup-form">
                    <p class="forget-success-icon"><img src="~assets/images/round_check_fill.png" alt=""></p>
                    <p class="forget-success-info"><span class="no-underline">{{email}}</span>激活成功&nbsp&nbsp<a href="/signin" class="forget-resend">立即登陆</a></p>
                </div>
                <div v-if="error">
                    <p class="forget-success-info">{{error}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import request from '~/net/request'

    export default {
        data () {
            return {}
        },
        validate ({ params }) {
            var hasId = !!params.id
            var hasKey = !!params.key
            return hasId && hasKey
        },
        asyncData (context) {
            return request.activeUser({
                client: context.req,
                params: {
                    id: context.params.id || '',
                    key: context.params.key || ''
                }
            }).then(res => {
                if (res.errNo === 0) {
                    console.log(res.data)
                    return {
                        email: res.data.email,
                        success: true,
                        error: '',
                        user: context.user
                    }
                } else {
                    return {
                        success: false,
                        error: res.msg,
                        user: context.user
                    }
                }
            })
        },
        head () {
            return {
                title: '账号激活'
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
    @import '~assets/styles/reset/pwd.css'
</style>
