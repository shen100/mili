<template>
    <Modal
        :value="modalVisible"
        @on-visible-change="onModalVisibleChange"
        :title="bookID ? '编辑开源图书' : '创建开源图书'"
        footer-hide>
        <Form ref="formNode" :model="formData" :rules="rules" :label-width="80">
            <FormItem prop="name" label="图书名称">
                <Input v-model="formData.name" placeholder="请输入图书名称" />
            </FormItem>
            <FormItem prop="summary" label="摘要">
                <Input v-model="formData.summary" :rows="2" type="textarea" placeholder="请输入摘要..." />
            </FormItem>
            <FormItem prop="coverURL" label="封面图片">
                <SimpleUploader ref="simpleUploader" v-if="uploadPolicy" :uploadPolicy="uploadPolicy" 
                    @success="onImgUploadSuccess" @remove="onImgRemove" :img="formData.coverURL"/>
            </FormItem>
            <FormItem prop="contentType" label="编辑器">
                <Select v-if="!bookID" v-model="formData.contentType">
                    <Option :value="ArticleContentType.Markdown" :key="ArticleContentType.Markdown">markdown</Option>
                    <Option :value="ArticleContentType.HTML" :key="ArticleContentType.HTML">富文本</Option>
                </Select>
                <div v-else>{{formData.contentType === ArticleContentType.Markdown ? 'markdown' : '富文本'}}</div>
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
import { ArticleContentType } from '~/js/constants/article.js';
import SimpleUploader from '~/js/components/admin/common/SimpleUploader.vue';

export default {
    props: ['bookID', 'contentType'],
    data() {
        return {
            modalVisible: false,
            ArticleContentType,
            uploadPolicy: null,
            formData: {
                name: '',
                coverURL: '',
                summary: '',
                contentType: this.contentType || ArticleContentType.Markdown,
            },
            rules: {
                name: [
                    { required: true, message: '请输入图书名称', trigger: 'blur' }
                ],
                summary: [
                    { required: true, message: '请输入摘要', trigger: 'blur' }
                ],
                coverURL: [
                    {
                        required: true, // 仅仅是为了在图标旁边加个红*
                        trigger: 'change', 
                        validator: (rule, value, callback) => {
                            // 直接回调callback, 由后台来验证
                            callback()
                        }
                    }
                ],
                contentType: [
                    {
                        required: true,
                        trigger: 'change', 
                        validator: (rule, value, callback) => {
                            callback();
                        }
                    }
                ]
            },
        }
    },
    mounted() {
        this.reqPolicy();
    },
    methods: {
        reqPolicy() {
            const url = `/common/oss/policy`;
            myHTTP.get(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.uploadPolicy = res.data.data.uploadPolicy;
                    return;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        onOk() {
            this.$refs['formNode'].validate((valid) => {
                if (!valid) {
                    return;
                }
                let reqMethod;
                let url = '/admin/books';
                const data = {
                    name: this.formData.name,
                    coverURL: this.formData.coverURL,
                    summary: this.formData.summary,
                    contentType: this.formData.contentType,
                };
                if (this.bookID) {
                    reqMethod = myHTTP.put;
                    url += `/${this.bookID}`;
                    data.id = this.bookID;
                } else {
                    reqMethod = myHTTP.post;
                }
                reqMethod(url, data).then((res) => {
                    if (res.data.errorCode !== ErrorCode.SUCCESS.CODE) {
                        this.$Message.error(res.data.message);
                        return;
                    }
                    this.$emit('book-updated', {
                        name: this.formData.name,
                        coverURL: this.formData.coverURL,
                    });
                    this.modalVisible = false;
                    this.formData.name = '';
                    this.formData.coverURL = '';
                    this.$refs.simpleUploader.setImgURL('');
                }).catch(err => {
                    this.$Message.error(err.message);
                });
            });
        },
        onCancel() {
            this.modalVisible = false;
        },
        show() {
            this.modalVisible = true;
            if (this.bookID) {
                myHTTP.get(`/books/detail/${this.bookID}`).then(res => {
                    let book = res.data.data;
                    this.formData.name = book.name;
                    this.formData.coverURL = book.coverURL;
                    this.formData.summary = book.summary;
                    this.formData.contentType = book.contentType;
                    this.$refs.simpleUploader.setImgURL(book.coverURL);
                });
            }
        },
        onModalVisibleChange(visible) {
            this.modalVisible = visible;
        },
        onImgUploadSuccess(imgURL) {
            this.formData.coverURL = imgURL;
        },
        onImgRemove() {
            this.formData.coverURL = '';
        },
    },
    components: {
        SimpleUploader,
    }
}
</script>