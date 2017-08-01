<template>
    <i-row class="golang-forget-form">
    	<i-form ref="formCustom" :model="formCustom" :rules="ruleCustom">
    		<Form-item prop="email">
                <i-input v-model="formCustom.email" placeholder="请输入注册时的邮箱"></i-input>
            </Form-item>
        </i-form>
        <i-button type="primary" class="forget-button" @click="handleSubmit('formCustom')">发送邮件</i-button>
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
