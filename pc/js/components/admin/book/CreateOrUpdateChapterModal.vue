<template>
    <Modal
        :value="modalVisible"
        @on-visible-change="onModalVisibleChange"
        :title="title"
        footer-hide>
        <Form ref="formDOM" :model="formData" :rules="rules" :label-width="80">
            <FormItem prop="chapterName" label="章节名称">
                <Input v-model="formData.chapterName" placeholder="请输入章节名称" />
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
    props: ['bookID'],
    data() {
        return {
            modalVisible: false,
            title: '',
            chapterID: undefined,
            parentChapterID: undefined,
            formData: {
                chapterName: '',
            },
            rules: {
                chapterName: [
                    { required: true, message: '请输入章节名称', trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        onOk() {
            this.$refs['formDOM'].validate((valid) => {
                if (!valid) {
                    return;
                }
                let reqMethod;
                let url = '/admin/books/chapters';
                const data = {
                    name: this.formData.chapterName,
                    bookID: this.bookID,
                };
                if (this.parentChapterID) {
                    data.parentChapterID = this.parentChapterID;
                }
                if (this.chapterID) {
                    reqMethod = myHTTP.put;
                    url += `/${this.chapterID}`;
                } else {
                    reqMethod = myHTTP.post;
                }
                reqMethod(url, data).then((res) => {
                    if (res.data.errorCode !== ErrorCode.SUCCESS.CODE) {
                        this.$Message.error(res.data.message);
                        return;
                    }
                    if (!this.chapterID) {
                        this.$emit('chapter-created', {
                            title: this.formData.chapterName,
                            id: res.data.data.id,
                            parentChapterID: data.parentChapterID,
                        });
                    } else {
                        this.$emit('chapter-updated', {
                            title: this.formData.chapterName,
                            id: this.chapterID,
                        });
                    }
                    this.formData.chapterName = '';
                    this.modalVisible = false;
                }).catch(err => {
                    console.log(err);
                });
            });
        },
        onCancel() {
            this.modalVisible = false;
        },
        show(data) {
            this.formData.chapterName = data.title;
            this.chapterID = data.id;
            this.parentChapterID = data.parentID;
            this.title = this.chapterID ? '编辑章节' : '添加章节';
            this.modalVisible = true;
        },
        onModalVisibleChange(visible) {
            this.modalVisible = visible;
        },
    }
}
</script>
