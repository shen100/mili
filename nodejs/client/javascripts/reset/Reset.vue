<template>
	<i-row class="reset-container">
		<i-form ref="formCustom" :model="formCustom" :rules="ruleCustom" class="reset-form" :label-width="80" v-if="!success">
	        <Form-item label="新密码" prop="passwd">
	            <i-input type="password" v-model="formCustom.passwd" class="signup-input"></i-input>
	        </Form-item>
	        <Form-item label="确认密码" prop="passwdCheck">
	            <i-input type="password" v-model="formCustom.passwdCheck" class="signup-input"></i-input>
	        </Form-item>
	        <i-button type="primary" class="forget-button" @click="handleSubmit('formCustom')">提交</i-button>
	    </i-form>
	    <div v-if="success" class="signup-form">
	    	<p class="forget-success-icon"><img src="/images/round_check_fill.png" alt=""></p>
            <p class="forget-success-info">密码修改成功请重新登陆</p>
	    </div>
    </i-row>
</template>

<script>
	import Form        from 'iview/src/components/form';
	import Input       from 'iview/src/components/input';
	import Button      from 'iview/src/components/button';
	import Message     from 'iview/src/components/message';
    import {Row, Col}  from 'iview/src/components/grid';
	import Req 	       from '../utils/Request';

    const id    = jsonData.id;
    const key   = jsonData.key

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
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                if (!id || !key) {
                    return this.$Message.error('访问页面有误');
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                    	if (this.loading) {
                    		return;
                    	}
                    	this.loading = true;
                    	Req.resetPwd({
                    		id,
                    		key,
                    		password: this.formCustom.passwd
                    	})
                    	.then(res => {
                    		this.loading = false;
                    		this.success = true;
                    		
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
            IRow: Row,
			IButton: Button
		}
	}
</script>

<style>
    .reset-container {
        padding-top: 20px;
    }
	.reset-form {
        width: 380px;
        margin: 0 auto;
    }
	.signup-input {
		width: 300px;
	}
</style>