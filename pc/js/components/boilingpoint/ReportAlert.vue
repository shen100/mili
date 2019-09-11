<template>
    <Modal v-model="modalVisible" class-name="vertical-center-modal" 
        :width="428" :closable="false" :mask-closable="true" footer-hide>
        <div slot="header" class="alert-modal-header">
            <button @click="onCancel" type="button" class="close">×</button>
            <h4>举报沸点</h4>
        </div>
        <div class="alert-modal-body">
            <RadioGroup v-model="reason">
                <Radio :label="1">
                    <span>和话题不符</span>
                </Radio>
                <Radio :label="2">
                    <span>恶意攻击谩骂</span>
                </Radio>
                <Radio :label="3">
                    <span>广告营销</span>
                </Radio>
                <Radio :label="0">
                    <span>其它</span>
                </Radio>
            </RadioGroup>
        </div>
        <div class="alert-modal-footer">
            <button @click="onOk" class="submit">确认</button> 
            <button @click="onCancel" class="cancel">取消</button>
        </div>
    </Modal>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';

export default {
    data () {
        return {
            reason: 1,
            modalVisible: false,
            boilingPointID: undefined,
        };
    },
    methods: {
        show(boilingPointID) {
            this.boilingPointID = boilingPointID;
            this.modalVisible = true;
        },
        onOk() {
            const url = `/boilingpoints/${this.boilingPointID}/report`;
            const data = {
                reason: parseInt(this.reason),
            };
            myHTTP.post(url, data).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.$emit('ok');
                    this.modalVisible = false;
                } else {
                    this.$emit('ok');
                    this.modalVisible = false;
                }
            });
        },
        onCancel() {
            this.$emit('cancel');
            this.modalVisible = false;
        }
    }
}
</script>

<style>
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

.ivu-radio-checked .ivu-radio-inner {
    border-color: #ea6f5a!important;
}

.ivu-radio-inner:after {
    background-color: #ea6f5a!important;
}

.ivu-radio-checked:hover .ivu-radio-inner {
    border-color: #ea6f5a!important;
}

.ivu-radio-focus {
    box-shadow: 0 0 0 2px rgba(236, 97, 73, 0.2);
    z-index: 1;
}
</style>


