<template>
    <div>
        <!-- <Upload :action="uploadActionURL"
            :on-success="onUploadCallback" :on-error="onUploadError" :name="uploadFieldName"
            :data="uploadData" :format="imgFormat" :before-upload="beforeUpload"
            :show-upload-list="false"
            :on-format-error="onFormatError">
            <slot></slot>
        </Upload> -->
        <input type="file" ref="file" name="myfile" hidden />
    </div>
</template>

<script>
import mime from 'mime';
import uuid from 'uuid/v4';
import axios from 'axios';
import { ossResponseParse } from '~/js/utils/utils.js';
import { ErrorCode } from '~/js/constants/error.js';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import { myHTTP } from '~/js/common/net.js';

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
            onFileChangeProxy: null,
        }
    },
    mounted() {
        this.onFileChangeProxy = this.onFileChange.bind(this);
        this.$refs.file.addEventListener('change', this.onFileChangeProxy);
    },
    methods: {
        select() {
            this.$refs.file.click();
        },
        onFileChange(event) {
            let files = event.target.files;
            console.log(files);
            if (!files.length) {
                return;
            }
            const file = files[0];
            let format = mime.getExtension(file.type);
            if (format.charAt(0) === '.') {
                format = format.substr(1);
            }
            console.log(format, this.imgMaxSize, this.imgFormat.indexOf(format));
            if (this.imgFormat.indexOf(format) <= 0) {
                this.$emit('formatError', '只支持' + this.imgFormat.join(', ') + '格式');
                this.clearFile();
                return;
            }
            if (file.size > this.imgMaxSize) {
                this.$emit('maxSizeError', this.imgMaxSizeError);
                this.clearFile();
                return;
            }
            
            this.uploadData.key = this.uploadPrefix + '/' + uuid() + '.' + format;

            let form = new FormData();
            for (let key in this.uploadData) {
                form.append(key, this.uploadData[key]);
            }
            form.append(this.uploadFieldName, file);
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            axios.post(this.uploadActionURL, form, config).then(res => {
                res = res.data;
                if (process.env.NODE_ENV === 'development') {
                    // 本地开发时，图片上传成功后，没有走阿里oss服务器回调，这时，再发个请求给应用服务器
                    let imgData = ossResponseParse(res, this.uploadImgURL);
                    if (imgData.url) {
                        const url = `/common/oss/createimg`;
                        myHTTP.post(url, { path: imgData.path }).then((res) => {
                            if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                                this.$emit('success', imgData.url, res.data.data);
                            }
                        }).catch((err) => {
                            this.$emit('error', '上传失败');
                        });
                        return;
                    }
                } else {
                    if (res.errorCode === ErrorCode.SUCCESS.CODE) {
                        const imgData = res.data;
                        this.$emit('success', imgData.url, res.data);
                        return;
                    }
                }
                this.$emit('error', '上传凭证过期，请刷新浏览器重试');
            });
        },
        clearFile() {
            this.$refs.file.value = null;
        }
    }
}
</script>
