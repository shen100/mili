<template>
    <i-row type="flex" align="middle" justify="center" class="golang-signin-container">
        <i-col :xs="24" :lg="6" :md="14">
            <h1 class="golang-signin-title">GOLANG123</h1>
            <p class="golang-signin-desc">像风一样GO的飞起</p>
        	<i-form ref="formCustom" :model="formCustom" :rules="ruleCustom" class="signup-form">
        		<Form-item prop="username">
                    <i-input v-model="formCustom.username" placeholder="用户名 / 邮箱"></i-input>
                </Form-item>
                <Form-item prop="passwd">
                    <i-input type="password" v-model="formCustom.passwd" placeholder="密码" @keydown.native="handleKeyUp"></i-input>
                </Form-item>
                <p style="text-align: right;padding-right: 10px">
                    <a href="/forget/pwd" class="golang-common-link">忘记密码</a>
                </p>
                <Form-item style="margin-top: 10px">
                    <i-button type="primary" @click="handleSubmit('formCustom')" style="width: 100%">登录</i-button>
                </Form-item>
            </i-form>
        </i-col>
    </i-row>
</template>

<script>
	import Form        from 'iview/src/components/form';
	import Input       from 'iview/src/components/input';
	import Button      from 'iview/src/components/button';
	import Message     from 'iview/src/components/message';
    import {Row, Col}  from 'iview/src/components/grid';
	import Req 	       from '../utils/Request';

	export default {
		data() {
            this.$Message = Message;
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
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.loading) {
                            return;
                        }
                        this.loading = true;
                        Req.signin({
                            signinInput: this.formCustom.username,
                            password: this.formCustom.passwd,
                        })
                        .then(res => {
                            this.loading = false;
                            window.location.href = '/';
                            this.$Message.success('登录成功!');
                        })
                        .catch(err => {
                            this.loading = false;
                            this.$Message.error(err.msg);
                        })
                    }
                })
            },
            handleKeyUp(e) {
                if (e.keyCode === 13) {
                    return this.handleSubmit('formCustom');
                }
            }
        },
		components: {
			IForm: Form,
			FormItem: Form.Item,
			IInput: Input,
			IButton: Button,
            IRow: Row,
            ICol: Col
		}
	}
</script>
