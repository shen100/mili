<template>
    <div class="main-area">
        <div>
            <h1 class="user-info">个人资料</h1>
            <ul class="setting-list">
                <li class="item">
                    <span class="title">头像</span>
                    <div class="avatar-uploader">
                        <input type="file" class="input" />
                        <div class="lazy avatar avatar loaded" style=""></div>
                        <div class="action-box">
                            <div class="hint">支持 jpg、png 格式大小 5M 以内的图片</div>
                            <button class="upload-btn">点击上传</button>
                        </div>
                    </div>
                </li>
                <li class="item">
                    <span class="title">用户名</span>
                    <div class="input-box profile-input">
                        <input spellcheck="false" placeholder="填写你的用户名" class="input">
                        <div class="action-box">
                            <button tabindex="-1" class="btn edit-btn">
                                <img src="../../../images/settings/edit_icon.svg" class="icon" />
                                <span>修改</span>
                            </button>
                        </div>
                    </div>
                </li>
                <li class="item">
                    <span class="title">职位</span>
                    <div class="input-box profile-input">
                        <input spellcheck="false" placeholder="填写你的职位" class="input">
                        <div class="action-box">
                            <button tabindex="-1" class="btn edit-btn">
                                <img src="../../../images/settings/edit_icon.svg" class="icon" />
                                <span>修改</span>
                            </button>
                        </div>
                    </div>
                </li>
                <li class="item">
                    <span class="title">公司</span>
                    <div class="input-box profile-input">
                        <input spellcheck="false" placeholder="填写你的公司" class="input">
                        <div class="action-box">
                            <button tabindex="-1" class="btn edit-btn">
                                <img src="../../../images/settings/edit_icon.svg" class="icon" />
                                <span>修改</span>
                            </button>
                        </div>
                    </div>
                </li>
                <li class="item">
                    <span class="title">个人介绍</span>
                    <div class="input-box profile-input">
                        <input spellcheck="false" placeholder="填写职业技能、擅长的事情、喜欢的事情等" class="input">
                        <div class="action-box">
                            <button tabindex="-1" class="btn edit-btn">
                                <img src="../../../images/settings/edit_icon.svg" class="icon" />
                                <span>修改</span>
                            </button>
                        </div>
                    </div>
                </li>
                <li class="item">
                    <span class="title">个人主页</span>
                    <div class="input-box profile-input">
                        <input spellcheck="false" placeholder="填写你的个人主页" class="input">
                        <div class="action-box">
                            <button tabindex="-1" class="btn edit-btn">
                                <img src="../../../images/settings/edit_icon.svg" class="icon" />
                                <span>修改</span>
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    
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
</style>