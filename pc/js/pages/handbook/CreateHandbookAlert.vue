<template>
    <div>
        <ErrorTip ref="errorTip" />
        <Modal :value="true" class-name="vertical-center-modal" 
            width="448" :closable="false" :mask-closable="false" footer-hide>
            <div slot="header" class="alert-modal-header">
                <h4>输入小册标题</h4>
            </div>
            <div class="alert-modal-body">
                <div class="heading-input">
                    <input v-model="name">
                </div>
            </div>
            <div class="alert-modal-footer">
                <button @click="onOk" class="submit">确认</button>
                <button @click="onCancel" class="cancel">取消</button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Vue from 'vue';
import {
    Modal,
} from 'iview';
import { myHTTP } from '~/js/common/net.js';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import { ErrorCode } from '~/js/constants/error.js';

Vue.component('Modal', Modal);

export default {
    data () {
        return {
            name: '',
        };
    },
    methods: {
        onOk() {
            const url = '/handbooks';
            myHTTP.post(url, { name: this.name }).then((res) => {
                if (res.data.errorCode !== ErrorCode.SUCCESS.CODE) {
                    this.$refs.errorTip.show(res.data.message);
                    return;
                }
                const id = res.data.data.id;
                this.$emit('ok', {
                    name: this.name,
                    id,
                });
                this.$router.push({ path: `/handbooks/${id}/chapter/introduce/edit` });
            }).catch((err) => {
                console.log(err);
            });
        },
        onCancel() {
            location.href = '/';
        }
    },
    components: {
        ErrorTip,
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