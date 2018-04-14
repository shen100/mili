<template>
    <div>
        <div class="golang-forget-container">
            <h1>账号安全中心</h1>
            <p class="golang-forget-title">重置密码</p>
            <div id="reset" class="golang-forget-form">
                <Row class="reset-container" v-if="!error">
                    <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" class="reset-form" :label-width="80" v-if="!success">
                        <Form-item label="新密码" prop="passwd">
                            <i-input size="large" type="password" v-model="formCustom.passwd" class="signup-input"></i-input>
                        </Form-item>
                        <Form-item label="确认密码" prop="passwdCheck">
                            <i-input
                                size="large"
                                type="password"
                                v-model="formCustom.passwdCheck"
                                @keyup.native="handleKeyUp"
                                class="signup-input"></i-input>
                        </Form-item>
                        <i-button size="large" type="primary" class="reset-pwd-button" @click="handleSubmit('formCustom')">重置密码</i-button>
                    </Form>
                    <div v-if="success" class="signup-form">
                        <p class="forget-success-icon"><img src="~assets/images/round_check_fill.png" alt=""></p>
                        <p class="forget-success-info">密码修改成功&nbsp&nbsp<a href="/signin" class="forget-resend">立即登陆</a></p>
                    </div>
                </Row>
                <div class="signup-form" v-if="error">
                    <p class="forget-success-info" style="margin-top: 0;padding-top: 30px;">{{error}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ErrorCode from '~/constant/ErrorCode'
    import Account from '~/constant/Account'
    import request from '~/net/request'
    import config from '~/config'

    let id = ''
    let key = ''

    export default {
        data () {
            id = this.$route.params.id || ''
            key = this.$route.params.key || ''
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
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            }
            return {
                loading: false,
                formCustom: {
                    passwd: '',
                    passwdCheck: ''
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
                    ]
                }
            }
        },
        validate ({ params }) {
            var hasId = !!params.id
            var hasKey = !!params.key
            return hasId && hasKey
        },
        asyncData (context) {
            return request.verifyUrl({
                client: context.req,
                params: {
                    id: context.params.id,
                    key: context.params.key
                }
            }).then(res => {
                if (res.errNo === ErrorCode.SUCCESS) {
                    return {
                        user: context.user,
                        error: ''
                    }
                } else {
                    return {
                        user: context.user,
                        error: res.msg
                    }
                }
            })
        },
        head () {
            return {
                title: '重置密码'
            }
        },
        methods: {
            handleKeyUp (e) {
                if (e.keyCode === 13) {
                    return this.handleSubmit('formCustom')
                }
            },
            handleSubmit (name) {
                if (!id || !key) {
                    return this.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: '访问页面有误'
                    })
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.loading) {
                            return
                        }
                        this.loading = true
                        request.resetPwd({
                            params: {
                                id,
                                key
                            },
                            body: {
                                password: this.formCustom.passwd
                            }
                        }).then(res => {
                            this.loading = false
                            // 重置密码时是通过点击邮件中的链接，所以不用登录
                            if (res.errNo === 0) {
                                this.success = true
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
        layout: 'nosidebar'
    }
</script>

<style>
    @import '../../../assets/styles/reset/pwd.css'
</style>
