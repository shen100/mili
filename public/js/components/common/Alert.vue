<template>
    <Modal v-model="modalVisible" class-name="vertical-center-modal" 
        :width="width" :closable="false" :mask-closable="true" footer-hide>
        <div slot="header" class="alert-modal-header">
            <button @click="onCancel" type="button" class="close">×</button>
            <h4>{{title}}</h4>
        </div>
        <div class="alert-modal-body">{{text}}</div>
        <div class="alert-modal-footer">
            <button @click="onOk" class="submit">确认</button> 
            <button @click="onCancel" class="cancel">取消</button>
        </div>
    </Modal>
</template>

<script>
export default {
    props: [
        'width',
        'value',
    ],
    data () {
        return {
            modalVisible: false,
            title: '',
            text: '',
        };
    },
    methods: {
        show(title, text) {
            this.modalVisible = true;
            this.title = title;
            this.text = text;
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
</style>


