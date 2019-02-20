<template>
    <div id="app" class="main">
        <h4 class="title">
            <div class="normal-title">
                <a class href="/signin.html">登录</a>
                <b>·</b>
                <a id="js-sign-up-btn" class="active" href="/signup.html">注册</a>
            </div>
        </h4>
        <div class="js-sign-up-container">
            <form action method="post">
                <div class="input-prepend restyle">
                    <input v-model="login" placeholder="你的昵称" type="text">
                    <i class="iconfont ic-user"></i>
                </div>
                <div class="input-prepend restyle no-radius js-normal">
                    <input v-model="phone" placeholder="手机号" type="tel">
                    <i class="iconfont ic-phonenumber"></i>
                </div>
                <div v-show="phoneInputed" class="input-prepend restyle no-radius security-up-code js-security-number">
                    <input v-model="code" type="text" name="sms_code" placeholder="手机验证码">
                    <i class="iconfont ic-verify"></i>
                    <a @click="reqCaptchaBtnClick" :class="{'btn-in-resend': phoneValid && smsEnabled}" class="btn-up-resend js-send-code-button disable">{{smsLabel}}</a>
                </div>
                <div class="input-prepend">
                    <input v-model="pass" placeholder="设置密码" type="password">
                    <i class="iconfont ic-password"></i>
                </div>
                <input @click.prevent="onSubmit" type="submit" value="注册" class="sign-up-button" />
                <p class="sign-up-msg">点击 “注册” 即表示您同意并愿意遵守{{siteName}}<br> 
                <a target="_blank" href="">用户协议</a> 和 <a target="_blank" href="">隐私政策</a> 。</p>
            </form>
            <div class="more-sign">
                <h6>社交帐号直接注册</h6>
                <ul>
                    <li>
                        <a class="github" href="/users/signup/github.html">
                            <div class="github-icon">
                                <svg height="24" class="octicon octicon-mark-github" viewBox="0 0 16 16" version="1.1" width="24" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
                            </div>
                        </a>
                    </li>
                    <li><a class="weixin" target="_blank" href="/users/auth/wechat.html"><i class="iconfont ic-wechat"></i></a></li>
                    <li><a class="qq" target="_blank" href="/users/auth/qq.html"><i class="iconfont ic-qq_connect"></i></a></li>
                    <li class=""><a class="weibo" href="/users/signup/weibo.html"><i class="iconfont ic-weibo"></i></a></li>
                </ul>
            </div>
        </div>
        <div v-if="errorTipVisible" :style="{top: errorTipTop}" class="tooltip tooltip-error fade right in" role="tooltip">
            <div class="tooltip-arrow tooltip-arrow-border" style="top: 50%;"></div>
            <div class="tooltip-arrow tooltip-arrow-bg" style="top: 50%;"></div>
            <div class="tooltip-inner">
                <i class="iconfont ic-error"></i>
                <span>{{errorTipLabel}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import validator from 'validator';
import { ErrorCode } from '~/js/constants/error.js';
import { myHTTP } from '~/js/common/net.js';

export default {
    name: 'App',
    data: function() {
        return {
            siteName: window.siteName,
            phoneInputed: false,
            phone: '',
            login: '',
            pass: '',
            phoneValid: false,
            code: '', // 手机验证码
            smsEnabled: true,
            smsLabel: '发送验证码',
            smsCountdown: 60, // 每60秒才能发一次手机验证码
            geetestCaptcha: null,
            errorTipLabel: '',
            errorTipTop: 0,
            errorTipVisible: false
        };
    },
    mounted: function() {
        const self = this;
        const url = '/users/geetestconfig';
        myHTTP.get(url).then((result) => {
            const data = result.data.data;
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: true,
                product: 'bind'
            }, function (captchaObj) {
                self.geetestCaptcha = captchaObj;
                self.geetestCaptcha.onSuccess(function() {
                    self.sendSMS();
                });
            })
        });
    },
    methods: {
        onSubmit: function() {
            const self = this;
            let login = (this.login || '').replace(/^\s+|\s+$/g, '');
            if (!this.login) {
                this.errorTipLabel = '昵称 不能为空';
                this.showErrorTip('username');
                this.errorTipTop = '210.75px';
                return;
            }
            if (!this.validatePhone(this.phone)) {
                this.errorTipLabel = '无效的手机号';
                return this.showErrorTip('phone');
            }
            if (!this.code) {
                this.errorTipLabel = '验证码无效或已过期，请重新发送验证码';
                return this.showErrorTip('code');
            }
            if (!this.pass) {
                this.errorTipLabel = '密码 不能为空';
                return this.showErrorTip('password', '密码 不能为空');
            }
            let captchaResult = this.geetestCaptcha.getValidate();
            captchaResult = captchaResult || {};
            const url = '/users/signup';
            myHTTP.post(url, {
                geetest_challenge: captchaResult.geetest_challenge,
                geetest_validate: captchaResult.geetest_validate,
                geetest_seccode: captchaResult.geetest_seccode,
                login: login,
                phone: this.phone,
                code: this.code,
                pass: this.pass
            }).then(function(res) {
                const result = res.data;
                if (result.errorCode) {
                    self.errorTipLabel = result.message;
                }
                if (result.errorCode === ErrorCode.InvalidUserName.CODE) {
                    return self.showErrorTip('username');
                }
                if (result.errorCode === ErrorCode.InvalidPhone.CODE) {
                    return self.showErrorTip('phone');
                }
                if (result.errorCode === ErrorCode.InvalidCaptcha.CODE) {
                    return self.showErrorTip('code');
                }
                if (result.errorCode === ErrorCode.InvalidPassword.CODE) {
                    return self.showErrorTip('password');
                }
                if (result.errorCode === ErrorCode.UserNameExists.CODE) {
                    self.showErrorTip('username');
                    self.errorTipTop = '210.75px';
                    return;
                }
                if (result.errorCode === ErrorCode.PhoneExists.CODE) {
                    return self.showErrorTip('phone');
                }
                location.href = '/';
            });

        },
        reqCaptchaBtnClick: function() {
            if (!this.validatePhone(this.phone)) {
                return;
            }
            if (this.geetestCaptcha) {
                this.geetestCaptcha.verify();
            }
        },
        sendSMS: function(ticket, randstr) {
            const self = this;
            let captchaResult = this.geetestCaptcha.getValidate();
            if (!captchaResult) {
                return;
            }
            const reqData = {
                geetest_challenge: captchaResult.geetest_challenge,
                geetest_validate: captchaResult.geetest_validate,
                geetest_seccode: captchaResult.geetest_seccode,  
                phone: this.phone
            };

            const url = '/users/smscode';
            myHTTP.post(url, reqData);

            let time = self.smsCountdown;
            self.smsEnabled = false;
            self.smsLabel = `重新发送(${time}s)`;
            const intervalID = setInterval(function() {
                time--;
                self.smsLabel = `重新发送(${time}s)`;
                if (time < 0) {
                    self.smsLabel = '重新发送';
                    self.smsEnabled = true;
                    clearInterval(intervalID);
                }
            }, 1000);
        },
        validatePhone: function(phone) {
            if (validator.isMobilePhone(phone, 'zh-CN')) {
                this.phoneValid = true;
            } else {
                this.phoneValid = false;   
            }
            return this.phoneValid;
        },
        showErrorTip: function(field) {
            this.errorTipVisible = true;
            switch (field) {
                case 'username': {
                    this.errorTipTop = '186.75px';
                    break;
                }
                case 'phone': {
                    this.errorTipTop = '261.25px';
                    break;
                }
                case 'code': {
                    this.errorTipTop = '297px';
                    break;
                }
                case 'password': {
                    this.errorTipTop = '359px';
                    break;
                }
            }
        }
    },
    watch: {
        phone: function(newValue, oldValue) {
            if (newValue !== oldValue) {
                if (this.validatePhone(newValue)) {
                    this.phoneInputed = true;
                }
            }
        }
    }
};
</script>
