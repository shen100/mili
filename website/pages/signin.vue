<template>
    <Row type="flex" align="middle" justify="center" class="golang-signin-container">
        <Col :xs="24" :lg="6" :md="14">
            <h1 class="golang-signin-title">GOLANG123</h1>
            <p class="golang-signin-desc">像风一样GO的飞起</p>
        	<Form ref="formCustom" :model="formCustom" :rules="ruleCustom" class="signup-form">
        		<Form-item prop="username">
                    <i-input v-model="formCustom.username" placeholder="用户名 / 邮箱"></i-input>
                </Form-item>
                <Form-item prop="passwd">
                    <i-input type="password" v-model="formCustom.passwd" placeholder="密码" @keydown.native="handleKeyUp"></i-input>
                </Form-item>
                <p style="text-align: right;padding-right: 10px">
                    <a href="/reset/pwd" class="golang-common-link">忘记密码</a>
                </p>
                <Form-item style="margin-top: 10px">
                    <i-button type="primary" @click="handleSubmit('formCustom')" style="width: 100%">登录</i-button>
                </Form-item>
            </Form>
        </Col>
        <script type="text/javascript" color="45,140,240" opacity='0.7' zIndex="-2" count="99" src="//cdn.bootcss.com/canvas-nest.js/1.0.1/canvas-nest.min.js"></script>
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
                        { required: true, message: '请填写密码', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ]
                }
            }
        },
        layout: 'signin',
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
