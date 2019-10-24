<template>
    <Modal v-model="modalVisible" class-name="vertical-center-modal" 
        :width="640" :closable="false" :mask-closable="true" footer-hide>
        <div slot="header" class="alert-modal-header">
            <button @click="onCancel" type="button" class="close">×</button>
        </div>
        <div class="alert-modal-body">
            <div class="weixin-share-title">微信分享</div>
            <div class="scan-text">打开微信“扫一扫”，打开网页后点击屏幕右上角分享按钮</div>
            <div class="qrcode-box">
                <img v-if="qrcodeURL" :src="qrcodeURL">
            </div>
        </div>
    </Modal>
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

.alert-modal-header {
    height: 30px;
    padding: 0;
}

.alert-modal-header .close {
    margin-top: 4px;
    margin-right: 6px;
}

.alert-modal-body {
    display: block;
}

.ivu-modal-mask {
    background-color: $bgMask!important;
    z-index: 1041!important;
}

.ivu-modal-wrap {
    z-index: 1041!important;
}

.ivu-modal-header {
    padding: 0;
    border-bottom: none;
}

.ivu-modal-body {
    padding: 0;
}

.vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
}

.vertical-center-modal .ivu-modal {
    top: 0;
}

.ivu-modal-content {
    box-shadow: 0 5px 25px rgba(0, 0, 0, .1);
    border: 1px solid rgba(0, 0, 0, .1);
    border-radius: 3px;
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
    margin-bottom: 4px;
}

.qrcode-box {
    text-align: center;
    padding-top: 0;
    padding-bottom: 30px;
}
</style>