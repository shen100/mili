<template>
    <div id="app" class="main">
        <transition name="custom-classes-transition"
                enter-active-class="animated shake"
                leave-active-class="animated fadeOutUp">
            <div v-if="errorVisible" class="sign-error-msg">{{errorMsg}}</div>
        </transition>
        <h4 class="title">
            <div class="normal-title">
                <a class="active" href="/signin.html">登录</a>
                <b>·</b>
                <a id="js-sign-up-btn" href="/signup.html">注册</a>
            </div>
        </h4>
        <div class="js-sign-in-container">
            <form method="post">
                <div class="input-prepend restyle js-normal">
                    <input v-model="login" placeholder="手机号或邮箱" type="text">
                    <i class="iconfont ic-user"></i>
                </div>
                <div class="input-prepend">
                    <input v-model="password" placeholder="密码" type="password">
                    <i class="iconfont ic-password"></i>
                </div>
                <div class="remember-btn">
                    <input type="checkbox" value="true" checked="checked"><span>记住我</span>
                </div>
                <div class="forget-btn">
                    <a data-toggle="dropdown" href="">登录遇到问题?</a>
                    <ul class="dropdown-menu">
                        <li><a href="">用手机号重置密码</a></li>
                        <li><a href="">用邮箱重置密码</a></li>
                        <li><a target="_blank" href="">无法用海外手机号登录</a></li>
                        <li><a target="_blank" href="">无法用 Google 帐号登录</a></li>
                    </ul>
                </div>
                <button @click="onSubmit" class="sign-in-button" type="button">
                    <span id="sign-in-loading"></span>
                    登录
                </button>
            </form>
            <div class="more-sign">
                <h6>社交帐号登录</h6>
                <ul>
                    <li>
                        <a class="github" href="/users/signup/github.html">
                            <div class="github-icon">
                                <svg height="24" class="octicon octicon-mark-github" viewBox="0 0 16 16" version="1.1" width="24" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
                            </div>
                        </a>
                    </li>
                    <li><a class="weixin" target="_blank" href=""><i class="iconfont ic-wechat"></i></a></li>
                    <li><a class="qq" target="_blank" href=""><i class="iconfont ic-qq_connect"></i></a></li>
                    <li class=""><a class="weibo"><i class="iconfont ic-weibo"></i></a></li>
                    <li class="js-more-method"><a href="javascript:void(0);"><i class="iconfont ic-more"></i></a></li>
                </ul>
                <div class="weibo-geetest-captcha"></div>
            </div>
        </div>
    </div>
</template>

<script>
import validator from 'validator';
import { ErrorCode } from '~/js/constants/error.js';
import { myHTTP } from '~/js/common/net.js';

export default {
    data: function() {
        return {
            login: '',
            password: '',
            errorVisible: false,
            errorDisplayDur: 10000,
            geetestCaptcha: null
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
                    self.submit();
                });
            })
        });

    },
    methods: {
        verifyData: function () {
            let login = (this.login || '').replace(/^\s+|\s+$/, '');
            this.login = login;
            if (!login) {
                this.errorVisible = true;
                this.errorMsg = '手机号码/邮箱地址或密码不能为空';
                setTimeout(() => {
                    this.errorVisible = false;
                }, this.errorDisplayDur);
                return false;
            }
            if (!this.password) {
                this.errorVisible = true;
                this.errorMsg = '手机号码/邮箱地址或密码不能为空';
                setTimeout(() => {
                    this.errorVisible = false;
                }, this.errorDisplayDur);
                return false;
            }
            return true;
        },
        onSubmit: function() {
            if (!this.verifyData()) {
                return;
            }
            if (this.geetestCaptcha) {
                this.geetestCaptcha.verify();
            }   
        },
        submit: function() {
            if (!this.verifyData()) {
                return;
            }
            this.errorVisible = false;

            let captchaResult = this.geetestCaptcha.getValidate();
            captchaResult = captchaResult || {};

            let reqData = {
                geetest_challenge: captchaResult.geetest_challenge,
                geetest_validate: captchaResult.geetest_validate,
                geetest_seccode: captchaResult.geetest_seccode,
                login: this.login,
                password: this.password,
            };
            if (validator.isMobilePhone(this.login, 'zh-CN')) {
                reqData.verifyType = 'phone';
            } else {
                reqData.verifyType = 'email';
            }

            const url = '/users/signin';
            myHTTP.post(url, reqData).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    location.href = window.loginReferer;
                    return;
                }
                this.errorVisible = true;
                this.errorMsg = res.data.message;
                setTimeout(() => {
                    this.errorVisible = false;
                }, this.errorDisplayDur);
            });
        }
    }
}
</script>
