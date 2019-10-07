<template>
    <div class="main-area">
        <SuccessTip ref="successTip" />
        <ErrorTip ref="errorTip" />
        <div>
            <h1 class="user-info">修改密码</h1>
            <ul class="setting-list">
                <li class="item">
                    <span class="title">旧密码</span>
                    <div class="input-box profile-input">
                        <input v-model="oldPassword" spellcheck="false" type="password" placeholder="请输入原密码" class="input">
                    </div>
                </li>
                <li class="item">
                    <span class="title">新密码</span>
                    <div class="input-box profile-input">
                        <input v-model="password" spellcheck="false" type="password" placeholder="请输入新密码" class="input">
                    </div>
                </li>
                <li class="item">
                    <span class="title">确认新密码</span>
                    <div class="input-box profile-input">
                        <input v-model="confirmPassword" spellcheck="false" type="password" placeholder="确认新密码" class="input">
                    </div>
                </li>
            </ul>
            <button @click="onSubmit" class="submit-btn">保存修改</button>
        </div>
    </div>
</template>

<script>
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import SuccessTip from '~/js/components/common/SuccessTip.vue';

export default {
    data() {
        return {
            oldPassword: '',
            password: '',
            confirmPassword: '',
        };
    },
    methods: {
        onSubmit() {
            if (!this.oldPassword) {
                this.$refs.errorTip.show('旧密码错误');
                return;
            }
            if (this.password !== this.confirmPassword) {
                this.$refs.errorTip.show('两次输入的密码不一致');
                return;
            }
            const data = {
                oldPass: this.oldPassword,
                pass: this.password
            };
            myHTTP.put('/users/password', data).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.oldPassword = '';
                    this.password = '';
                    this.confirmPassword = '';
                    this.$refs.successTip.show('密码修改成功');
                } else {
                    this.$refs.errorTip.show(res.data.message);
                }
            });
        }
    },
    components: {
        ErrorTip,
        SuccessTip,
    }
}
</script>

<style lang="scss" scoped>
.main-area {
    width: 696px;
    background-color: #fff;
    position: relative;
    padding: 32px 48px 84px 48px;
    border-radius: 2px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
}

.user-info {
    font-size: 24px;
    margin: 16px 0;
}

.setting-list .item {
    display: flex;
    align-items: center;
    padding: 24px 0;
    border-top: 1px solid #f1f1f1;
}

.setting-list .item .title {
    font-size: 16px;
    color: #333;
    width: 120px;
}

.avatar-uploader {
    display: flex;
}

.u-avatar {
    flex: 0 0 auto;
    width: 72px;
    height: 72px;
    margin-right: 12px;
    display: inline-block;
    position: relative;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #eee;
}

.setting-list .item .action-box {
    margin-left: 12px;
}

.hint {
    color: #909090;
    font-size: 12px;
    margin-bottom: 18px;
}

.upload-btn {
    -webkit-appearance: none;
    appearance: none;
    background-color: #007fff;
    color: #fff;
    border-radius: 2px;
    border: none;
    padding: 6px 16px;
    outline: none;
    transition: background-color .3s, color .3s;
    cursor: pointer;
}

.upload-btn:hover {
    background-color: #0371df;
    color: #fff;
}

.profile-input {
    display: flex;
    justify-content: flex-end;
    flex: 1;
}

.setting-list .input {
    flex: 1;
    display: inline-block;
    border: none;
    outline: none;
    color: #909090;
    font-size: 16px;
}


.setting-list .edit-btn {
    -webkit-appearance: none;
    appearance: none;
    border-radius: 2px;
    border: none;
    outline: none;
    transition: background-color .3s, color .3s;
    cursor: pointer;
    background-color: transparent;
    color: #ea6f5a;
    font-size: 14px;
    padding: 0;
    white-space: nowrap;
}

.setting-list .icon {
    vertical-align: bottom;
    height: 18px;
    margin-right: 7px;
}

.setting-list .item:last-child {
    border-bottom: 1px solid #f1f1f1;
}

.submit-btn {
    -webkit-appearance: none;
    appearance: none;
    border-radius: 2px;
    border: none;
    outline: none;
    transition: background-color .3s, color .3s;
    cursor: pointer;
    float: right;
    margin-top: 18px;
    padding: 10px 16px;
    font-size: 16px;
    color: #fff;
    background-color: #ea6f5a;
}

.profile-input input::-webkit-input-placeholder {
    color: #c2c2c2;
}
</style>