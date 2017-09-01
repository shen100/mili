<template>
    <div>
        <app-header :user="user" />
        <div class="golang-home-body">
            <div class="golang-main-top">
                <div class="mine-img-box"></div>
                <div class="mine-edit-container">
                    <div class="mine-info-icon">
                        <img :src="user.avatarURL" alt="" />
                        <div class="mine-info-upload">
                            <img src="~assets/images/camera_fill.png" alt="">
                            <p>修改我的头像</p>
                        </div>
                    </div>
                    <p class="mine-info-line mine-info-name">{{user.name}}</p>
                    <Form class="mine-edit-form">
                        <Form ref="formCustom" :model="formCustom" :label-width="80" class="signup-form" v-if="!success" style="height: 500px">
                            <Form-item label="性别" prop="gender">
                                <i-input size="large" type="text" v-model="formCustom.gender" class="signup-input"></i-input>
                            </Form-item>
                            <Form-item label="一句话介绍" prop="desc">
                                <i-input size="large" type="textarea" v-model="formCustom.desc" class="signup-input"></i-input>
                            </Form-item>
                            <Form-item label="所在地" prop="home">
                                <i-input size="large" type="text" v-model="formCustom.home" class="signup-input"></i-input>
                            </Form-item>
                            <Form-item label="个人简介" prop="info">
                                <i-input size="large" type="textarea" v-model="formCustom.info" class="signup-input"></i-input>
                            </Form-item>
                            <i-button type="primary" size="large" class="signup-button" @click="handleSubmit('formCustom')">提交</i-button>
                        </Form>
                    </Form>
                </div>
            </div>
        </div>
        <app-footer />
    </div>
</template>

<script>
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'

    export default {
        data () {
            return {
                formCustom: {
                    gender: '',
                    desc: '',
                    home: '',
                    info: ''
                },
                success: false,
                ruleCustom: {
                    gender: [
                        { required: true, message: '请输入性别', trigger: 'blur' }
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
        head () {
            return {
                title: '个人信息'
            }
        },
        components: {
            'app-header': Header,
            'app-footer': Footer
        }
    }
</script>

<style>
    @import '~assets/styles/mine/index.css'
</style>