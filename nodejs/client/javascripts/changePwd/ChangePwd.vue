<template>
	<div>
		<i-form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80" class="signup-form">
            <Form-item label="旧密码" prop="lastPasswd">
                <i-input type="password" v-model="formCustom.lastPasswd" class="signup-input"></i-input>
            </Form-item>
	        <Form-item label="新密码" prop="passwd">
	            <i-input type="password" v-model="formCustom.passwd" class="signup-input"></i-input>
	        </Form-item>
	        <Form-item label="确认密码" prop="passwdCheck">
	            <i-input type="password" v-model="formCustom.passwdCheck" class="signup-input"></i-input>
	        </Form-item>
	        <Form-item>
	            <i-button type="primary" @click="handleSubmit('formCustom')">提交</i-button>
	            <a href="/"><i-button type="ghost" style="margin-left: 80px">返回</i-button></a>
	        </Form-item>
	    </i-form>
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
                    lastPasswd: '',
                    passwd: '',
                    passwdCheck: ''
                },
                ruleCustom: {
                    lastPasswd: [
                        { required: true, message: '请填写原密码', trigger: 'blur' }
                    ],
                    passwd: [
                    	{ required: true, message: '请填写新密码', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                    	{ required: true, message: '请验证密码', trigger: 'blur' },
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
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
                    	Req.changePwd({
                    		password: this.formCustom.lastPasswd,
                    		newPwd: this.formCustom.passwd,
                    	})
                    	.then(res => {
                    		this.loading = false;
                    		this.$Message.success('提交成功!');
                    		window.location.href = '/';
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