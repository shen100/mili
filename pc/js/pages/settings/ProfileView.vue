<template>
    <div class="main-area">
        <ErrorTip ref="errorTip" />
        <div>
            <h1 class="user-info">个人资料</h1>
            <ul class="setting-list">
                <li class="item">
                    <span class="title">头像</span>
                    <div class="avatar-uploader">
                        <div class="avatar-loaded" :style="{'background-image': `url(${avatarURL})`}"></div>
                        <div class="action-box">
                            <div class="hint">支持 jpg、png 格式大小 {{imgMaxSizeLabel}}M 以内的图片</div>
                            <CroppieImage :uploadPolicy="uploadPolicy"
                                    :imageFormat="imageFormat"
                                    @uploading="onImgUploading"
                                    @success="onImgUploadSuccess" @error="onImgUploadFail">
                                <button class="upload-btn">点击上传</button>
                            </CroppieImage>
                        </div>
                    </div>
                </li>
                <li v-clickoutside="onUpdatingUserNameHidden" class="item">
                    <span class="title">用户名</span>
                    <div class="input-box profile-input">
                        <input v-model="username" @focus="onUpdatingUserName" spellcheck="false" placeholder="填写你的用户名" class="input">
                        <div class="action-box">
                            <button v-show="!updatingUserName" @click="onUpdatingUserName" tabindex="-1" class="btn edit-btn">
                                <img src="../../../images/settings/edit_icon.svg" class="icon" />
                                <span>修改</span>
                            </button>
                            <button v-show="updatingUserName" @click="onSave('username', 'oldUsername', 'updatingUserName')" class="user-save-btn">保存</button>
                            <button v-show="updatingUserName" @click="onUpdatingUserNameHidden('cancel')" class="user-cancel-btn">取消</button>
                        </div>
                    </div>
                </li>
                <li v-clickoutside="onUpdatingJobHidden" class="item">
                    <span class="title">职位</span>
                    <div class="input-box profile-input">
                        <input v-model="job" @focus="onUpdatingJob" spellcheck="false" placeholder="填写你的职位" class="input">
                        <div class="action-box">
                            <button v-show="!updatingJob" @click="onUpdatingJob" tabindex="-1" class="btn edit-btn">
                                <img src="../../../images/settings/edit_icon.svg" class="icon" />
                                <span>修改</span>
                            </button>
                            <button v-show="updatingJob" @click="onSave('job', 'oldJob', 'updatingJob')" class="user-save-btn">保存</button>
                            <button v-show="updatingJob" @click="onUpdatingJobHidden('cancel')" class="user-cancel-btn">取消</button>
                        </div>
                    </div>
                </li>
                <li v-clickoutside="onUpdatingCompanyHidden" class="item">
                    <span class="title">公司</span>
                    <div class="input-box profile-input">
                        <input v-model="company" @focus="onUpdatingCompany" spellcheck="false" placeholder="填写你的公司" class="input">
                        <div class="action-box">
                            <button v-show="!updatingCompany" @click="onUpdatingCompany" tabindex="-1" class="btn edit-btn">
                                <img src="../../../images/settings/edit_icon.svg" class="icon" />
                                <span>修改</span>
                            </button>
                            <button v-show="updatingCompany" @click="onSave('company', 'oldCompany', 'updatingCompany')" class="user-save-btn">保存</button>
                            <button v-show="updatingCompany" @click="onUpdatingCompanyHidden('cancel')" class="user-cancel-btn">取消</button>
                        </div>
                    </div>
                </li>
                <li v-clickoutside="onUpdatingIntroduceHidden" class="item">
                    <span class="title">个人介绍</span>
                    <div class="input-box profile-input">
                        <input v-model="introduce" @focus="onUpdatingIntroduce" spellcheck="false" placeholder="填写职业技能、擅长的事情、喜欢的事情等" class="input">
                        <div class="action-box">
                            <button v-show="!updatingIntroduce" @click="onUpdatingIntroduce" tabindex="-1" class="btn edit-btn">
                                <img src="../../../images/settings/edit_icon.svg" class="icon" />
                                <span>修改</span>
                            </button>
                            <button v-show="updatingIntroduce" @click="onSave('introduce', 'oldIntroduce', 'updatingIntroduce')" class="user-save-btn">保存</button>
                            <button v-show="updatingIntroduce" @click="onUpdatingIntroduceHidden('cancel')" class="user-cancel-btn">取消</button>
                        </div>
                    </div>
                </li>
                <li v-clickoutside="onUpdatingPersonalHomePageHidden" class="item">
                    <span class="title">个人主页</span>
                    <div class="input-box profile-input">
                        <input v-model="personalHomePage" @focus="onUpdatingPersonalHomePage" spellcheck="false" placeholder="填写你的个人主页" class="input">
                        <div class="action-box">
                            <button v-show="!updatingPersonalHomePage" @click="onUpdatingPersonalHomePage" tabindex="-1" class="btn edit-btn">
                                <img src="../../../images/settings/edit_icon.svg" class="icon" />
                                <span>修改</span>
                            </button>
                            <button v-show="updatingPersonalHomePage" @click="onSave('personalHomePage', 'oldPersonalHomePage', 'updatingPersonalHomePage')" class="user-save-btn">保存</button>
                            <button v-show="updatingPersonalHomePage" @click="onUpdatingPersonalHomePageHidden('cancel')" class="user-cancel-btn">取消</button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import CroppieImage from '~/js/components/common/CroppieImage.vue';
import { trim } from '~/js/utils/utils.js';
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';

export default {
    data() {
        return {
            uploadPolicy: window.uploadPolicy,
            imgMaxSizeLabel: parseInt(window.uploadPolicy.imgMaxSize / 1024 / 1024), // 字节转为 M
            imageFormat: window.uploadPolicy.imgFormat,
            avatarURL: window.user.avatarURL || '',
            username: window.user.username,
            job: window.user.job,
            company: window.user.company,
            introduce: window.user.introduce,
            personalHomePage: window.user.personalHomePage,
            oldUsername: window.user.username,
            oldJob: window.user.job,
            oldCompany: window.user.company,
            oldIntroduce: window.user.introduce,
            oldPersonalHomePage: window.user.personalHomePage,
            updatingUserName: false,
            updatingJob: false,
            updatingCompany: false,
            updatingIntroduce: false,
            updatingPersonalHomePage: false,
        };
    },
    methods: {
        onUpdatingUserName() {
            this.updatingUserName = true;
        },
        onUpdatingUserNameHidden(interactiveType) {
            // 点取消按钮时，interactiveType为 cancel
            if (interactiveType === 'cancel') {
                this.updatingUserName = false;
                this.username = this.oldUsername;
                return;
            }
            // 走到这里，说明是 v-clickoutside 调用的
            if (this.username === this.oldUsername) {
                this.updatingUserName = false;
                return;
            }
        },
        onUpdatingJob() {
            this.updatingJob = true;
        },
        onUpdatingJobHidden(interactiveType) {
            if (interactiveType === 'cancel') {
                this.updatingJob = false;
                this.job = this.oldJob;
                return;
            }
            if (this.job === this.oldJob) {
                this.updatingJob = false;
                return;
            }
        },
        onUpdatingCompany() {
            this.updatingCompany = true;
        },
        onUpdatingCompanyHidden(interactiveType) {
            if (interactiveType === 'cancel') {
                this.updatingCompany = false;
                this.company = this.oldCompany;
                return;
            }
            if (this.company === this.oldCompany) {
                this.updatingCompany = false;
                return;
            }
        },
        onUpdatingIntroduce() {
            this.updatingIntroduce = true;
        },
        onUpdatingIntroduceHidden(interactiveType) {
            if (interactiveType === 'cancel') {
                this.updatingIntroduce = false;
                this.introduce = this.oldIntroduce;
                return;
            }
            if (this.introduce === this.oldIntroduce) {
                this.updatingIntroduce = false;
                return;
            }
        },
        onUpdatingPersonalHomePage() {
            this.updatingPersonalHomePage = true;
        },
        onUpdatingPersonalHomePageHidden(interactiveType) {
            if (interactiveType === 'cancel') {
                this.updatingPersonalHomePage = false;
                this.personalHomePage = this.oldPersonalHomePage;
                return;
            }
            if (this.personalHomePage === this.oldPersonalHomePage) {
                this.updatingPersonalHomePage = false;
                return;
            }
        },
        onImgUploading() {
        },
        onImgUploadSuccess(imgURL) {
            myHTTP.put('/users/info', { avatarURL: imgURL }).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.avatarURL = imgURL;
                }
            });
        },
        onImgUploadFail(message) {
            this.$refs.errorTip.show(message);
        },
        onSave(field, oldField, updatingField) {
            if (this[oldField] === this[field]) {
                this[updatingField] = false;
                return;
            }
            this[field] = trim(this[field]);
            const data = {
                [field]: this[field]
            };
            myHTTP.put('/users/info', data).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this[oldField] = this[field];
                    this[updatingField] = false;
                } else {
                    this.$refs.errorTip.show(res.data.message);
                }
            });
        },
    },
    components: {
        CroppieImage,
        ErrorTip,
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
    background-color: #42c02e;
    color: #fff;
    border-radius: 2px;
    border: none;
    padding: 6px 16px;
    outline: none;
    transition: background-color .3s, color .3s;
    cursor: pointer;
}

.upload-btn:hover {
    background-color: #3db922;
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

.avatar-loaded {
    display: inline-block;
    position: relative;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #eee;
    flex: 0 0 auto;
    width: 72px;
    height: 72px;
    margin-right: 12px;
}

.user-save-btn {
    border: 0;
    color: #ea6f5a;
    font-size: 14px;
    margin-right: 6px;
}

.user-cancel-btn {
    border: 0;
    color: #666;
    font-size: 14px;
}

.profile-input input::-webkit-input-placeholder {
    color: #c2c2c2;
}
</style>