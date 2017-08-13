<template>
	<div>
        <go-header :userStatus="user"/>
        <div class="common-body-box">
            <div class="common-body-main">
                <ul class="common-body-nav">
                    <li><a href="/"><span>主页</span></a></li>
                    <li class="common-body-nav-sep"><span>/</span></li>
                    <li><span class="publish-label">注册</span></li>
                </ul>
        		<i-form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80" class="signup-form">
                    <Form-item label="旧密码" prop="lastPasswd">
                        <i-input type="password" v-model="formCustom.lastPasswd" class="signup-input"></i-input>
                    </Form-item>
        	        <Form-item label="新密码" prop="passwd">
        	            <i-input type="password" v-model="formCustom.passwd" class="signup-input"></i-input>
        	        </Form-item>
        	        <Form-item label="确认密码" prop="passwdCheck">
        	            <i-input type="password" v-model="formCustom.passwdCheck" class="signup-input"></i-input>
        	        </Form-item>
        	        <Form-item>
        	            <i-button type="primary" @click="handleSubmit('formCustom')">提交</i-button>
        	            <a href="/"><i-button type="ghost" style="margin-left: 80px">返回</i-button></a>
        	        </Form-item>
        	    </i-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import iview from 'iview'
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
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
                    lastPasswd: '',
                    passwd: '',
                    passwdCheck: ''
                },
                ruleCustom: {
                    lastPasswd: [
                        { required: true, message: '请填写原密码', trigger: 'blur' }
                    ],
                    passwd: [
                        { required: true, message: '请填写新密码', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { required: true, message: '请验证密码', trigger: 'blur' },
                        { validator: validatePassCheck, trigger: 'blur' }
                    ]
                }
            }
        },
        asyncData (context) {
            return {
                user: context.user
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
                        request.changePwd({
                            body: {
                                password: this.formCustom.lastPasswd,
                                newPwd: this.formCustom.passwd
                            }
                        }).then(res => {
                            this.loading = false
                            if (res.errNo === 1001) {
                                window.location.href = '/signin'
                            } else {
                                this.$Message.success('提交成功!')
                                window.location.href = '/'
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
            'go-header': Header,
            'go-footer': Footer
        }
    }
</script>

<style>
	.signup-form {
		margin-top: 20px;
		margin-left: 80px;
	}
	.signup-input {
		width: 300px;
	}
</style>