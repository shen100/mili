<template>
    <div>
        <go-header :userStatus="user"/>
        <div class="golang-forget-container">
            <h1>账号安全中心</h1>
            <p class="golang-forget-title">重置密码</p>
            <div id="reset" class="golang-forget-form">
                <Row class="reset-container">
                    <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" class="reset-form" :label-width="80" v-if="!success">
                        <Form-item label="新密码" prop="passwd">
                            <i-input size="large" type="password" v-model="formCustom.passwd" class="signup-input"></i-input>
                        </Form-item>
                        <Form-item label="确认密码" prop="passwdCheck">
                            <i-input size="large" type="password" v-model="formCustom.passwdCheck" class="signup-input"></i-input>
                        </Form-item>
                        <i-button size="large" type="primary" class="reset-pwd-button" @click="handleSubmit('formCustom')">重置密码</i-button>
                    </Form>
                    <div v-if="success" class="signup-form">
                        <p class="forget-success-icon"><img src="~assets/images/round_check_fill.png" alt=""></p>
                        <p class="forget-success-info">密码修改成功请重新登陆</p>
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

    let id = ''
    let key = ''

    export default {
        data () {
            id = this.$route.params.id || ''
            key = this.$route.params.key || ''
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
        asyncData (context) {
            return {
                user: context.user
            }
        },
        middleware: 'userInfo',
        methods: {
            handleSubmit (name) {
                if (!id || !key) {
                    return this.$Message.error('访问页面有误')
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
                            if (res.errNo === 0) {
                                this.success = true
                            } else {
                                this.$Message.error(res.msg)
                            }
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
