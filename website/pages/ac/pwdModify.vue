<template>
	<div>
        <div class="golang-forget-container">
            <h1>账号安全中心</h1>
            <p class="golang-forget-title">修改密码</p>
            <div id="reset" class="golang-forget-form">
        		<i-form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80" class="signup-form">
                    <Form-item label="旧密码" prop="lastPasswd">
                        <i-input type="password" v-model="formCustom.lastPasswd" class="signup-input"></i-input>
                    </Form-item>
        	        <Form-item label="新密码" prop="passwd">
        	            <i-input type="password" v-model="formCustom.passwd" class="signup-input"></i-input>
        	        </Form-item>
        	        <Form-item label="确认密码" prop="passwdCheck">
        	            <i-input @keyup.native="handleKeyUp" type="password" v-model="formCustom.passwdCheck" class="signup-input"></i-input>
        	        </Form-item>
        	        <Form-item>
        	            <i-button type="primary" @click="handleSubmit('formCustom')" style="margin-right: 30px;">提&nbsp&nbsp交</i-button>
        	            <a href="/"><i-button type="ghost">取&nbsp&nbsp消</i-button></a>
        	        </Form-item>
        	    </i-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Account from '~/constant/Account'
    import ErrorCode from '~/constant/ErrorCode'
    import request from '~/net/request'
    import {trim} from '~/utils/tool'
    import config from '~/config'

    export default {
        data () {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else if (value.length < Account.MIN_PWD) {
                    callback(new Error('密码长度不能少于' + Account.MIN_PWD + '位'))
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
        middleware: 'userRequired',
        methods: {
            handleKeyUp (e) {
                if (e.keyCode === 13) {
                    return this.handleSubmit('formCustom')
                }
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.loading) {
                            return
                        }
                        this.loading = true
                        request.changePwd({
                            body: {
                                password: trim(this.formCustom.lastPasswd),
                                newPwd: trim(this.formCustom.passwd)
                            }
                        }).then(res => {
                            this.loading = false
                            if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                                this.$Message.error({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: '登录超时'
                                })
                                setTimeout(function () {
                                    window.location.href = '/signin'
                                }, 3000)
                            } else if (res.errNo === ErrorCode.SUCCESS) {
                                this.$Message.success({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: '提交成功!'
                                })
                                setTimeout(function () {
                                    window.location.href = '/'
                                }, 3000)
                            } else {
                                this.$Message.error({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: res.msg
                                })
                            }
                        }).catch(err => {
                            this.loading = false
                            this.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: err.message
                            })
                        })
                    }
                })
            }
        },
        layout: 'nosidebar',
        head () {
            return {
                title: '修改密码'
            }
        }
    }
</script>

<style>
	@import '../../assets/styles/ac/pwdModify.css'
</style>
