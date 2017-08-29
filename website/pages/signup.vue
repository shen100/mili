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
    		<Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80" class="signup-form" v-if="!success" style="height: 500px">
    			<Form-item label="用户名" prop="username">
    	            <i-input size="large" type="text" v-model="formCustom.username" class="signup-input"></i-input>
                    <span class="signup-label">4-20位可由中文、数字、字母组成</span>
    	        </Form-item>
    	        <Form-item label="密码" prop="passwd">
    	            <i-input size="large" type="password" v-model="formCustom.passwd" class="signup-input"></i-input>
                    <span class="signup-label">密码由6-20个字符组成，区分大小写</span>
    	        </Form-item>
    	        <Form-item label="确认密码" prop="passwdCheck">
    	            <i-input size="large" type="password" v-model="formCustom.passwdCheck" class="signup-input"></i-input>
                    <span class="signup-label">请在此确认您的密码</span>
    	        </Form-item>
    	        <Form-item label="邮箱" prop="email">
    	            <i-input size="large" v-model="formCustom.email" class="signup-input"></i-input>
                    <span class="signup-label">请输入有效的电子邮箱</span>
    	        </Form-item>
	            <i-button type="primary" size="large" class="signup-button" @click="handleSubmit('formCustom')">立即注册</i-button>
    	    </Form>
    	    <div v-if="success" class="signup-message-box" style="height: 500px">
                <div>
                    <div class="message-mail-icon"><img src="~assets/images/mail.png" alt=""></div>
                    <div class="message-mail-right">
                        <p class="signup-reminder-text">我们发送了一封验证邮件到<span class="signup-resend">{{formCustom.email}}</span></p>
                        <p class="signup-reminder-text">请到您的邮箱收信，并点击其中的链接验证您的邮箱</p>
                        <a :href="`http://mail.${formCustom.email.split('@')[formCustom.email.split('@').length - 1]}`" target="_blank"><i-button type="primary">去邮箱验证</i-button></a>
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
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import Sidebar from '~/components/Sidebar'
    import ErrorCode from '~/constant/ErrorCode'
    import request from '~/net/request'

    export default {
        data () {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if (value.length < 6 || value.length > 20) {
                        return callback(new Error('密码必须6-20个字符'))
                    }
                    if (this.formCustom.passwdCheck !== '') {
                        // 对第二个密码框单独验证                        
                        this.$refs.formCustom.validateField('passwdCheck')
                    }
                    callback()
                }
            }
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入确认密码'))
                } else if (value !== this.formCustom.passwd) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }

            const validateUserName = (rule, value, callback) => {
                if (value && (value.length < 4 || value.length > 20)) {
                    callback(new Error('用户名长度必须4-20位'))
                }
                callback()
            }
            return {
                loading: false,
                formCustom: {
                    passwd: '',
                    passwdCheck: '',
                    username: '',
                    email: ''
                },
                success: false,
                ruleCustom: {
                    passwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { required: true, message: '请输入确认密码', trigger: 'blur' },
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { validator: validateUserName, trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ]
                }
            }
        },
        asyncData (context) {
            const user = context.user
            if (user) {
                let redirectURL = context.req.headers['referer'] || '/'
                context.redirect(redirectURL)
                return
            }
            return {
                user: user
            }
        },
        head () {
            return {
                title: '注册'
            }
        },
        middleware: 'userInfo',
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.loading) {
                            return
                        }
                        this.loading = true
                        request.signup({
                            body: {
                                name: this.formCustom.username,
                                password: this.formCustom.passwd,
                                email: this.formCustom.email
                            }
                        }).then(res => {
                            this.loading = false
                            if (res.errNo === ErrorCode.SUCCESS) {
                                this.success = true
                                this.$Message.success('提交成功!')
                            } else {
                                this.$Message.error(res.msg)
                            }
                        }).catch(err => {
                            this.loading = false
                            this.$Message.error(err.message)
                        })
                    }
                })
            }
        },
        components: {
            'app-header': Header,
            'app-footer': Footer,
            'app-sidebar': Sidebar
        }
    }
</script>

<style>
    @import '~assets/styles/signup.css'
</style>
