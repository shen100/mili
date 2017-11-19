<template>
    <div>
        <go-header :user="user"/>
        <div class="golang-forget-container">
            <h1>账号安全中心</h1>
            <p class="golang-forget-title">忘记密码</p>
            <div id="reset" class="golang-forget-form">
                <Row class="golang-forget-form">
                    <div v-if="!success">
                        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" action="javascript:void(0)">
                            <Form-item prop="email">
                                <i-input
                                    size="large"
                                    v-model="formCustom.email"
                                    @on-blur="blur('formCustom.email')"
                                    @keyup.native="handleKeyUp"
                                    placeholder="请输入邮箱"></i-input>
                            </Form-item>
                        </Form>
                        <i-button type="primary" class="forget-button" size="large" @click="handleSubmit('formCustom')">发送邮件</i-button>
                    </div>
                    <div v-if="success">
                        <p class="forget-success-icon"><img src="~assets/images/round_check_fill.png" alt=""></p>
                        <p class="forget-success-info">验证邮件已发送至您的邮箱，请注意查收!</p>
                        <p class="forget-success-info">没收到邮件？<span v-if="times > 0">{{times}}秒后</span><span :class="times > 0 ? 'not-resend' : 'forget-resend'" @click="reSend">重新发送</span></p>
                    </div>
                </Row>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import ErrorCode from '~/constant/ErrorCode'
    import request from '~/net/request'
    import {trim, trimBlur} from '~/utils/tool'

    export default {
        data () {
            return {
                loading: false,
                formCustom: {
                    email: ''
                },
                times: 0,
                success: false,
                ruleCustom: {
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { type: 'email', message: '请填写正确的邮箱', trigger: 'blur' }
                    ]
                }
            }
        },
        asyncData (context) {
            return {
                user: context.user
            }
        },
        head () {
            return {
                title: '忘记密码'
            }
        },
        middleware: 'userInfo',
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
                        request.sendEmailPwd({
                            body: {
                                email: trim(this.formCustom.email)
                            }
                        }).then(res => {
                            this.loading = false
                            if (res.errNo === ErrorCode.SUCCESS) {
                                this.success = true
                                this.times = 60
                            } else {
                                this.$Message.error(res.msg)
                            }
                        }).catch(err => {
                            this.loading = false
                            this.$Message.error(err.message)
                        })
                    }
                })
            },
            reSend () {
                if (this.times !== 0 || this.loading) {
                    return
                }
                request.sendEmailPwd({
                    body: {
                        email: this.formCustom.email
                    }
                }).then(res => {
                    this.loading = false
                    if (res.errNo === ErrorCode.SUCCESS) {
                        this.success = true
                        this.times = 60
                    } else {
                        this.$Message.error(res.msg)
                    }
                }).catch(err => {
                    this.loading = false
                    this.$Message.error(err.msg)
                })
            },
            blur (name) {
                trimBlur(name, this)
            }
        },
        mounted () {
            this.count = setInterval(() => {
                if (this.times > 0) {
                    this.times--
                }
            }, 1000)
        },
        destroyed () {
            clearInterval(this.count)
        },
        components: {
            'go-header': Header,
            'go-footer': Footer
        }
    }
</script>

<style>
    @import '../../assets/styles/reset/pwd.css'
</style>
