<template>
	<div>
		<i-form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80" class="signup-form" v-if="!success">
			<Form-item label="用户名" prop="username">
	            <i-input type="text" v-model="formCustom.username" class="signup-input"></i-input>
	        </Form-item>
	        <Form-item label="密码" prop="passwd">
	            <i-input type="password" v-model="formCustom.passwd" class="signup-input"></i-input>
	        </Form-item>
	        <Form-item label="确认密码" prop="passwdCheck">
	            <i-input type="password" v-model="formCustom.passwdCheck" class="signup-input"></i-input>
	        </Form-item>
	        <Form-item label="邮箱" prop="email">
	            <i-input type="password" v-model="formCustom.email" class="signup-input"></i-input>
	        </Form-item>
	        <Form-item>
	            <i-button type="primary" @click="handleSubmit('formCustom')">提交</i-button>
	            <a href="/"><i-button type="ghost" style="margin-left: 80px">返回</i-button></a>
	        </Form-item>
	    </i-form>
	    <div v-if="success" class="signup-form">
	    	注册成功，请进入邮箱激活邮件
	    </div>
    </div>
</template>

<script>
	import Form    from 'iview/src/components/form';
	import Input   from 'iview/src/components/input';
	import Button  from 'iview/src/components/button';
	import Message from 'iview/src/components/message';
	import Req 	   from '../utils/Request';

	export default {
		data () {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.formCustom.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formCustom.validateField('passwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.formCustom.passwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            this.$Message = Message;
            
            return {
            	loading: false,
                formCustom: {
                    passwd: '',
                    passwdCheck: '',
                    username: '',
                    email: ''
                },
                success: false,
                ruleCustom: {
                    passwd: [
                    	{ required: true, message: '请填写密码', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                    	{ required: true, message: '请验证密码', trigger: 'blur' },
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    username: [
                    	{ required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    email: [
                    	{ required: true, message: '请输入电子邮箱', trigger: 'blur'},
                    	{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }	
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                    	if (this.loading) {
                    		return;
                    	}
                    	this.loading = true;
                    	Req.signup({
                    		name: this.formCustom.username,
                    		password: this.formCustom.passwd,
                    		email: this.formCustom.email
                    	})
                    	.then(res => {
                    		this.loading = false;
                    		this.success = true;
                    		console.log(this);
                    		this.$Message.success('提交成功!');
                    		console.log(res);
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
			IButton: Button
		}
	}
</script>

<style>
	.signup-form {
		margin-top: 20px;
		margin-left: 80px;
	}
	.signup-input {
		width: 300px;
	}
</style>