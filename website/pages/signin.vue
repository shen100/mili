<template>
    <Row type="flex" align="middle" justify="center" class="golang-signin-container">
        <Col :xs="24" :lg="6" :md="14">
            <a class="golang-signin-title" href="/">GOLANG123</a>
            <p class="golang-signin-desc">与地鼠们分享你的知识、经验和见解</p>
        	<Form ref="formCustom" :model="formCustom" :rules="ruleCustom" class="signup-form">
        		<Form-item prop="username">
                    <i-input size="large" v-model="formCustom.username" placeholder="用户名 / 邮箱"></i-input>
                </Form-item>
                <Form-item prop="passwd">
                    <i-input size="large" type="password" v-model="formCustom.passwd" placeholder="密码" @keydown.native="handleKeyUp"></i-input>
                </Form-item>
                <p style="text-align: right;padding-right: 2px">
                    <a href="/signup" class="golang-common-link" style="margin-right: 12px;">立即注册</a>
                    <a href="/reset/pwd" class="golang-common-link">忘记密码</a>
                </p>
                <Form-item style="margin-top: 10px">
                    <i-button size="large" type="primary" @click="handleSubmit('formCustom')" style="width: 100%">登&nbsp;&nbsp;录</i-button>
                </Form-item>
            </Form>
        </Col>
        <script type="text/javascript" color="51,133,255" opacity='0.7' zIndex="1" count="80" src="/javascripts/canvasnest/canvas-nest.min.js"></script>
    </Row>
</template>

<script>
    import Vue from 'vue'
    import iview from 'iview'
    import ErrorCode from '~/constant/ErrorCode'
    import request from '~/net/request'

    Vue.use(iview)

    export default {
        data () {
            return {
                loading: false,
                formCustom: {
                    passwd: '',
                    username: ''
                },
                success: false,
                ruleCustom: {
                    passwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ]
                }
            }
        },
        layout: 'signin',
        head () {
            return {
                title: '登录 - '
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
                        request.signin({
                            body: {
                                signinInput: this.formCustom.username,
                                password: this.formCustom.passwd
                            }
                        }).then(res => {
                            this.loading = false
                            if (res.errNo === ErrorCode.SUCCESS) {
                                this.$Message.success('登录成功!')
                                window.location.href = '/'
                            } else {
                                this.$Message.error(res.msg)
                            }
                        }).catch(err => {
                            this.loading = false
                            this.$Message.error(err.msg)
                        })
                    }
                })
            },
            handleKeyUp (e) {
                if (e.keyCode === 13) {
                    return this.handleSubmit('formCustom')
                }
            }
        }
    }
</script>

<style>
    @import '~assets/styles/signin.css'
</style>
