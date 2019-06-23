<template>
    <Modal v-model="modalVisible" class-name="vertical-center-modal" 
        :width="width" :closable="false" :mask-closable="true" footer-hide>
        <div slot="header" class="alert-modal-header">
            <button @click="onCancel" type="button" class="close">×</button>
            <h4>输入章节标题</h4>
        </div>
        <div class="alert-modal-body">
            <div class="heading-input">
                <div class="order">{{chapterOrder}}.</div>
                <input v-model="chapterTitle">
            </div>
        </div>
        <div class="alert-modal-footer">
            <button @click="onOk" class="submit">确认</button> 
            <button @click="onCancel" class="cancel">取消</button>
        </div>
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
            chapterTitle: '',
            chapterOrder: 1,
            chapterID: undefined,
        };
    },
    methods: {
        show(chapterOrder, chapterTitle, chapterID) {
            this.modalVisible = true;
            this.chapterOrder = chapterOrder;
            this.chapterTitle = chapterTitle;
            this.chapterID = chapterID;
        },
        onOk() {
            this.$emit('ok', {
                chapterTitle: this.chapterTitle,
                chapterID: this.chapterID,
            });
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
.ivu-modal-mask {
    background-color: hsla(0, 0%, 100%, .8);
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

.heading-input {
    position: relative;
    font-size: 14px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    width: 100%;
}

.heading-input .order {
    height: 100%;
    border-bottom: 1px solid #ccc;
    width: auto;
    text-align: right;
    padding-left: 5px;
    line-height: 40px;
    height: 40px;
}

.heading-input input {
    outline: none;
    width: 100%;
    height: 40px;
    border: 0;
    border-bottom: 1px solid #ccc;
    padding: 5px;
}
</style>


