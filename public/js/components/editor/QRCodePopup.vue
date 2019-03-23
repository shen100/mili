<template>
    <Modal v-model="modalVisible" class-name="vertical-center-modal" 
        :width="360" :closable="false" :mask-closable="true" footer-hide>
        <div slot="header" class="alert-modal-header">
            <button @click="onCancel" type="button" class="close">×</button>
        </div>
        <div class="alert-modal-body">
            <div class="scan-text">打开微信“扫一扫”，打开网页后点击屏</div>
            <div class="scan-text">幕右上角分享按钮</div>
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
        'articleID'
    ],
    data () {
        return {
            modalVisible: false,
            mHostName: window.globalConfig.mHostName,
            qrcodeURL: ''
        };
    },
    mounted() {
        this.$nextTick(() => {
            const options = {
                width: 240,
                height: 240
            };
            QRCode.toDataURL(`https://${this.mHostName}/p/${this.articleID}.html`, options)
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

<style>
.alert-modal-body {
    display: block;
}

.ivu-modal-mask {
    background-color: hsla(0, 0%, 100%, .7);
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

.scan-text {
    color: #4d4d4d;
    font-size: 14px;
    text-align: center;
    margin-bottom: 4px;
}

.qrcode-box {
    text-align: center;
    padding-top: 5px;
    padding-bottom: 40px;
}
</style>