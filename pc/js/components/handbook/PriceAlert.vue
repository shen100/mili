<template>
    <Modal v-model="modalVisible" @on-visible-change="onVisibleChange" class-name="vertical-center-modal" 
        :width="width" :closable="false" :mask-closable="true" footer-hide>
        <div slot="header" class="alert-modal-header alert-price-modal-header">
            <button @click="onClose" type="button" class="close">×</button>
            <h4>收益与结算</h4>
        </div>
        <div class="alert-modal-body">
            <div class="price-content">你的小册收益 ＝ 销量 × ( 单价 - 折扣 ) × 70%

* 推广折扣：在推广期会有不同的优惠折扣，结算将按照折扣后的单价进行结算；
* 结算日期：在所有章节写作完成后，每月 10 日进行结算；
* 手续费：结账时会去除支付平台的手续费 0.6%；</div>
        </div>
        <div class="alert-modal-footer alert-price-modal-footer"></div>
    </Modal>
</template>

<script>
import Vue from 'vue';
import {
    Modal,
} from 'iview';

Vue.component('Modal', Modal);

export default {
    props: [
        'width',
    ],
    data () {
        return {
            modalVisible: false,
        };
    },
    methods: {
        show() {
            this.modalVisible = true;
        },
        onClose() {
            this.modalVisible = false;
        },
        onVisibleChange(visible) {
            if (!visible) {
                this.$emit('cancel');
            }
        }
    }
}
</script>

<style>
.ivu-modal-mask {
    background-color: hsla(0, 0%, 100%, .8);
}

.ivu-modal-header {
    padding: 0;
    border-bottom: none;
}

.alert-price-modal-header {
    padding-bottom: 12px;
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

.price-content {
    font-size: 14px;
    overflow-y: auto;
    white-space: pre-line;
}

.alert-price-modal-footer {
    padding: 0;
    height: 30px;
}
</style>


