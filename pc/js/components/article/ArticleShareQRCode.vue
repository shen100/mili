<template>
    <div v-if="modalVisible" class="shareqr-modal">>
        <div @click="onCancel" class="shareqr-modal-bg"></div>
        <div class="shareqr-modal-box">
            <div style="position: relative;">
                <div class="inner">
                    <button @click="onCancel" type="button" class="close">×</button>
                    <div class="shareqr-modal-body">
                        <div class="weixin-share-title">微信分享</div>
                        <div class="scan-text">打开微信“扫一扫”，打开网页后点击屏幕右上角分享按钮</div>
                        <div class="qrcode-box">
                            <img v-if="qrcodeURL" :src="qrcodeURL">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import QRCode from 'qrcode';

export default {
    props: [
        'url'
    ],
    data () {
        return {
            modalVisible: false,
            mURL: window.globalConfig.mURL,
            qrcodeURL: ''
        };
    },
    mounted() {
        this.$nextTick(() => {
            const options = {
                width: 200,
                height: 200
            };
            QRCode.toDataURL(this.url, options)
                .then(url => {
                    this.qrcodeURL = url;
                })
                .catch(err => {
                    console.error(err);
                })
        });
    },
    methods: {
        show() {
            this.modalVisible = true;
        },
        onOk() {
            this.$emit('ok');
            this.modalVisible = false;
        },
        onCancel() {
            this.$emit('cancel');
            this.modalVisible = false;
        }
    }
}
</script>
<style lang="scss">
@import '../../../styles/variable.scss';

.shareqr-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1050;
    overflow-x: hidden;
    overflow-y: hidden;
}

.shareqr-modal-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $bgMask;
}

.shareqr-modal-box {
    width: 640px;
    height: 350px;
    padding: 0 45px;
    background: #fff;
    position: absolute;
    margin: 0 auto;
    left: 0;
    right: 0;
    border-radius: 2px;
    top: 50%;
    margin-top: -175px;
    box-sizing: border-box;
}

.shareqr-modal-box.inner {
    position: relative;
    width: 100%;
    padding: 0;
    padding-top: 30px;
    border-radius: 2px;
    box-sizing: border-box;
    background-color: #fff;
}

.shareqr-modal-box .close {
    font-family: -apple-system,SF UI Text,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif;
    line-height: 1;
    color: #000;
    opacity: .4;
    filter: alpha(opacity=20);
    font-weight: 200;
    font-size: 32px;
    outline: none;
    text-shadow: none;
    padding: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
    -webkit-appearance: none;
    position: absolute;
    top: 3px;
    right: -38px;
}

.shareqr-modal-body {
    display: block;
    padding: 0 30px;
    font-size: 14px;
    color: #333;
    padding-top: 30px;
}

.weixin-share-title {
    text-align: center;
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 12px;
}

.scan-text {
    color: #4d4d4d;
    font-size: 16px;
    text-align: center;
    margin-bottom: 6px;
}

.qrcode-box {
    text-align: center;
    padding-top: 0;
}
</style>