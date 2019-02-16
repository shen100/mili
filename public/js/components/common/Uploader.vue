<template>
    <div class="uploader-box">
        <Upload :action="uploadActionURL"
            :on-success="onUploadCallback" :on-error="onUploadError" :name="uploadFieldName"
            :data="uploadData" :format="imgFormat" :before-upload="beforeUpload"
            :show-upload-list="false">
            <slot></slot>
        </Upload>
    </div>
</template>

<script>
import uuid from 'uuid/v4';
import Vue from 'vue';
import 'iview/dist/styles/iview.css';
import { Upload } from 'iview';
import { ossResponseParse } from '~/js/utils/utils.js';

Vue.component('Upload', Upload);

export default {
    props: [
    ],
    data () {
        return {
            imgFormat: window.uploadPolicy.imgFormat,
            uploadActionURL: window.uploadPolicy.uploadActionURL,
            uploadFieldName: window.uploadPolicy.uploadFieldName,
            uploadPrefix: window.uploadPolicy.uploadPrefix,
            imgMaxSize: window.uploadPolicy.imgMaxSize,
            imgMaxSizeError: window.uploadPolicy.imgMaxSizeError,
            uploadData: window.uploadPolicy.uploadData,
            uploadImgURL: window.uploadPolicy.uploadImgURL
        }
    },
    methods: {
        beforeUpload(file) {
            if (file.size > this.imgMaxSize) {
                this.$emit('error', this.imgMaxSizeError);
                return false;
            }
            let ext = '';
            let index = file.name.lastIndexOf('.');
            if (index >= 0) {
                ext = file.name.substr(index);
            }
            this.uploadData.key = this.uploadPrefix + '/' + uuid() + ext;
            return true
        },
        onUploadCallback (res, file) {
            let imgURL = ossResponseParse(res, this.uploadImgURL);
            if (imgURL) {
                this.$emit('success', imgURL);
                return;
            }
            this.$emit('error', '上传凭证过期，请刷新浏览器重试');
        },
        onUploadError() {
            this.$emit('error', '上传凭证过期，请刷新浏览器重试');
        },
    },
}
</script>

<style lang="scss" scoped>
.uploader-box {
    display: inline-block;
}
</style>

