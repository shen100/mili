<template>
    <Modal
        :value="modalVisible"
        @on-visible-change="onModalVisibleChange"
        title="抓取章节内容"
        footer-hide>
        <Form :model="formData" :label-width="80">
            <FormItem label="URL">
                <Input type="text" v-model="formData.url" placeholder="" />
            </FormItem>
            <FormItem label="正文选择器">
                <Input type="text" v-model="formData.contentSelector" placeholder="" />
            </FormItem>
        </Form>
        <div class="admin-modal-footer">
            <Button size="large" @click="onCancel">取消</Button>
            <Button class="ok" size="large" type="primary" @click="onOk">确认</Button>
        </div>
    </Modal>
</template>

<script>
import { ErrorCode } from '~/js/constants/error.js';
import { myHTTP } from '~/js/common/net.js';

export default {
    data() {
        return {
            modalVisible: false,
            formData: {
                url: '',
                titleSelector: '',
                contentSelector: '',
            },
        }
    },
    methods: {
        onOk() {
            this.isLoading = true;
            const url = '/admin/crawler';
            const data = {
                ...this.formData,
                from: 0,
            };
            myHTTP.post(url, data).then((res) => {
                this.isLoading = false;
                if (res.data.errorCode !== ErrorCode.SUCCESS.CODE) {
                    this.$Message.error(res.data.message);
                    return;
                }
                this.$emit('html-load', res.data.data.html);
                this.modalVisible = false;
            }).catch(err => {
                this.isLoading = false;
            });
        },
        onCancel() {
            this.modalVisible = false;
        },
        show() {
            this.modalVisible = true;
        },
        onModalVisibleChange(visible) {
            this.modalVisible = visible;
        },
    }
}
</script>