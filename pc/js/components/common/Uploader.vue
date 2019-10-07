<template>
    <div class="uploader-box">
        <ErrorTip ref="errorTip" />
        <Upload :action="uploadActionURL"
            :on-success="onUploadCallback" :on-error="onUploadError" :name="uploadFieldName"
            :data="uploadData" :format="imgFormat" :before-upload="beforeUpload"
            :show-upload-list="false"
            :on-format-error="onFormatError">
            <slot></slot>
        </Upload>
    </div>
</template>

<script>
import uuid from 'uuid/v4';
import Vue from 'vue';
import { Upload } from 'iview';
import { ossResponseParse } from '~/js/utils/utils.js';
import { ErrorCode } from '~/js/constants/error.js';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import { myHTTP } from '~/js/common/net.js';

Vue.component('Upload', Upload);

export default {
    props: [
        'uploadPolicy'
    ],
    data () {
        const uploadPolicy = this.uploadPolicy || window.uploadPolicy;
        return {
            imgFormat: uploadPolicy.imgFormat,
            uploadActionURL: uploadPolicy.uploadActionURL,
            uploadFieldName: uploadPolicy.uploadFieldName,
            uploadPrefix: uploadPolicy.uploadPrefix,
            imgMaxSize: uploadPolicy.imgMaxSize,
            imgMaxSizeError: uploadPolicy.imgMaxSizeError,
            uploadData: uploadPolicy.uploadData,
            uploadImgURL: uploadPolicy.uploadImgURL,
            lastImageURL: '', // 最后一次上传成功的图片URL
        }
    },
    methods: {
        onFormatError() {
            this.$refs.errorTip.show('不是有效的图片格式');
        },
        beforeUpload(file) {
            this.lastImageURL = '';
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
            this.$emit('uploading');
            return true;
        },
        onUploadCallback (res, file) {
            if (process.env.NODE_ENV === 'development') {
                // 本地开发时，图片上传成功后，没有走阿里oss服务器回调，这时，再发个请求给应用服务器
                let imgData = ossResponseParse(res, this.uploadImgURL);
                if (imgData.url) {
                    const url = `/common/oss/createimg`;
                    myHTTP.post(url, { path: imgData.path }).then((res) => {
                        if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                            this.lastImageURL = imgData.url;
                            this.$emit('success', imgData.url, res.data.data);
                        }
                    }).catch((err) => {

                    });
                    return;
                }
            } else {

            }
            this.$emit('error', '上传凭证过期，请刷新浏览器重试');
        },
        onUploadError() {
            this.lastImageURL = '';
            this.$emit('error', '上传凭证过期，请刷新浏览器重试');
        },
        getImageURL() {
            return this.lastImageURL;
        }
    },
    components: {
        ErrorTip,
    }
}
</script>

<style lang="scss">
.uploader-box {
    display: inline-block;
}

.ivu-upload-select {
    width: 100%;
}
</style>

