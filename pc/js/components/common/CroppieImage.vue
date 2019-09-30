<template>
    <div class="uploader-box">
        <ErrorTip ref="errorTip" />
        <!-- action传空, 真正上传是用axios发post请求 -->
        <Upload
            action=""
            accept="image/*"
            :show-upload-list="false"
            :before-upload="beforeUpload" :name="uploadFieldName" :format="imgFormat"
            :on-format-error="onFormatError">
            <slot></slot>
        </Upload>
        <Modal v-model="modalVisible" width="400">
            <div slot="header" style="color:#f60; text-align:center">
                <p id="uploader-pop-title">编辑封面图片</p>
                <p id="uploader-pop-subheading">调整尺寸和位置</p>
            </div>
            <div id="avatarUploader"></div>
            <div slot="footer">
                <div class="save-btn" @click="onUpload">保存</div>
            </div>
        </Modal>
    </div>
</template>

<script>
import axios from 'axios';
import uuid from 'uuid/v4';
import Vue from 'vue';
import { Modal, Upload } from 'iview';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import { ossResponseParse } from '~/js/utils/utils.js';
import { ErrorCode } from '~/js/constants/error.js';
import { myHTTP } from '~/js/common/net.js';

Vue.component('Modal', Modal);
Vue.component('Upload', Upload);

export default {
    props: [
        'imageFormat',
        'uploadPolicy'
    ],
    data() {
        const uploadPolicy = this.uploadPolicy || window.uploadPolicy;
        return {
            croppie: null,
            file: null,
            croppieImgWidth: 160,
            croppieImgHeight: 160,
            modalVisible: false,
            imgFormat: this.imageFormat || uploadPolicy.imgFormat,
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
        beforeUpload (file) {
            const self = this;
            this.file = file;
            if (file.size > this.imgMaxSize) {
                this.$refs.errorTip.show(this.imgMaxSizeError);
                return;
            }
            let ext = '';
            let index = file.name.lastIndexOf('.');
            if (index >= 0) {
                ext = file.name.substr(index);
            }
            this.uploadData.key = this.uploadPrefix + '/' + uuid() + ext;
            this.modalVisible = !this.modalVisible;
            this.$nextTick(() => {
                let avatarUploader = document.getElementById('avatarUploader');
                // avatarUploader.innerHTML = '';
                // self.croppie = null;
                const reader = new FileReader()
                reader.addEventListener('load', function() {
                    setTimeout(() => {
                        if (!self.croppie) {
                            self.croppie = new window.Croppie(avatarUploader, {
                                url: reader.result,
                                boundary: {
                                    width: self.croppieImgWidth + 80,
                                    height: self.croppieImgHeight + 80
                                },
                                viewport: {
                                    width: self.croppieImgWidth,
                                    height: self.croppieImgHeight,
                                    type: 'square'
                                }
                            });
                            return;
                        }
                        self.croppie.bind(reader.result);
                    }, 200);
                });
                reader.readAsDataURL(file);
            });
            return false;
        },
        onUpload () {
            this.croppie && this.croppie.result('blob').then((blob) => {
                let form = new FormData();
                for (let key in this.uploadData) {
                    form.append(key, this.uploadData[key]);
                }
                form.append(this.uploadFieldName, blob);
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
                            console.log('=========================>');
                            myHTTP.post(url, { path: imgData.path }).then((res) => {
                                console.log('=========================>2222222');
                                console.log(res);
                                console.log(ErrorCode);
                                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                                    this.lastImageURL = imgData.url;
                                    this.modalVisible = false;
                                    this.$emit('success', imgData.url, res.data.data);
                                }
                            }).catch((err) => {
                                this.$emit('error', '上传失败');
                            });
                            return;
                        }
                    } else {

                    }
                    this.$emit('error', '上传凭证过期，请刷新浏览器重试');
                })
            })
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

#uploader-pop-title {
    font-size: 24px;
    font-weight: 500;
    line-height: normal;
    height: 32px;
    color: #262626;
}

#uploader-pop-subheading {
    color: #8590a6;
}


#avatarUploader {
    min-height: 294px;
}

.save-btn {
    font-weight: 400;
    text-align: center;
    cursor: pointer;
    border: 1px solid transparent;
    padding: 0;
    user-select: none;
    height: 40px;
    line-height: 40px;
    border-radius: 2px;
    font-size: 15px;
    color: #fff;
    background-color: #ea6f5a;
    box-sizing: border-box;
}
</style>