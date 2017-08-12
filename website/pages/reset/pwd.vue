<template>
    <div>
        <go-header />
        <div class="golang-forget-container">
            <h1>账号安全中心</h1>
            <p class="golang-forget-title">重置密码</p>
            <div id="reset" class="golang-forget-form">
                <Row class="golang-forget-form">
                    <div v-if="!success">
                        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom">
                            <Form-item prop="email">
                                <i-input v-model="formCustom.email" placeholder="请输入注册时的邮箱"></i-input>
                            </Form-item>
                        </Form>
                        <i-button type="primary" class="forget-button" @click="handleSubmit('formCustom')">发送邮件</i-button>
                    </div>
                    <div v-if="success">
                        <p class="forget-success-icon"><img src="~assets/images/round_check_fill.png" alt=""></p>
                        <p class="forget-success-info">验证邮件已发送至您的邮箱，请点击查收!</p>
                    </div>
                </Row>
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
            return {
                loading: false,
                formCustom: {
                    email: ''
                },
                success: false,
                ruleCustom: {
                    email: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请填写正确的邮箱', trigger: 'blur' }
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
                        request.sendEmailPwd({
                            body: {
                                email: this.formCustom.email
                            }
                        }).then(res => {
                            this.loading = false
                            this.success = true
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
            'go-footer': Footer
        }
    }
</script>

<style>
    @import '~assets/styles/reset/pwd.css'
</style>
