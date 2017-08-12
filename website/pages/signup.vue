<template>
	<div>
        <go-header />
        <div class="signup-box">
            <div class="signup-main">
                <ul class="signup-nav">
                    <li><a href="/"><span>主页</span></a></li>
                    <li class="signup-nav-sep"><span>/</span></li>
                    <li><span class="publish-label">注册</span></li>
                </ul>
        		<Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80" class="signup-form" v-if="!success">
        			<Form-item label="用户名" prop="username">
        	            <i-input type="text" v-model="formCustom.username" class="signup-input"></i-input>
        	        </Form-item>
        	        <Form-item label="密码" prop="passwd">
        	            <i-input type="password" v-model="formCustom.passwd" class="signup-input"></i-input>
        	        </Form-item>
        	        <Form-item label="确认密码" prop="passwdCheck">
        	            <i-input type="password" v-model="formCustom.passwdCheck" class="signup-input"></i-input>
        	        </Form-item>
        	        <Form-item label="邮箱" prop="email">
        	            <i-input v-model="formCustom.email" class="signup-input"></i-input>
        	        </Form-item>
        	        <Form-item>
        	            <i-button type="primary" @click="handleSubmit('formCustom')">提交</i-button>
        	            <a href="/"><i-button type="ghost" style="margin-left: 80px">返回</i-button></a>
        	        </Form-item>
        	    </Form>
        	    <div v-if="success" class="signup-message-box">
                    <p class="message-success-icon"><img src="~assets/images/round_check_fill.png" alt=""></p>
        	    	<p class="message-success-info">注册成功，请进入邮箱激活邮件</p>
        	    </div>
            </div>
        </div>
        <go-footer />
    </div>
</template>

<script>
    import Vue from 'vue'
    import iview from 'iview'
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import Sidebar from '~/components/Sidebar'
    import request from '~/net/request'

    Vue.use(iview)

    export default {
        data () {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if (this.formCustom.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formCustom.validateField('passwdCheck')
                    }
                    callback()
                }
            }
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.formCustom.passwd) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
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
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { required: true, message: '请验证密码', trigger: 'blur' },
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入电子邮箱', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ]
                }
            }
        },
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
                            this.success = true
                            this.$Message.success('提交成功!')
                        }).catch(err => {
                            this.loading = false
                            this.$Message.error(err.msg)
                        })
                    }
                })
            }
        },
        components: {
            'go-header': Header,
            'go-footer': Footer,
            'go-sidebar': Sidebar
        }
    }
</script>

<style>
    @import '~assets/styles/signup.css'
</style>