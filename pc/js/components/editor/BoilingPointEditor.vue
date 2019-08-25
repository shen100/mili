<template>
    <CommentRichEditor ref="richEditor"
        placeholder="placeholder"
        editorType="boilingpoint"
        :uploadAllowed="uploadAllowed"
        :emptyPlaceholder="placeholder || '发布动态'" @success="onSuccess"
        @error="onError" @imgUploadSuccess="onImgUploadSuccess"
        @boilingPointSubmit="onBoilingPointSubmit"
        :sendDefVisible="true">
        <UploaderList v-if="imgCount" :uploadAllowed="uploadAllowed" ref="upList" @success="onImgUploadSuccess2" @remove="onImgRemove" slot="upload-list"></UploaderList>
        <div v-else class="no-img-box" slot="upload-list"></div>
    </CommentRichEditor>
</template>

<script>
import CommentRichEditor from '~/js/components/editor/CommentRichEditor.vue';
import UploaderList from '~/js/components/common/UploaderList.vue';
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';

export default {
    props: [
        'placeholder'
    ],
    data() {
        return {
            imgCount: 0,
        };
    },
    computed: {
        uploadAllowed() {
            return this.imgCount < 9;
        }
    },
    methods: {
        onImgUploadSuccess(imgURL) {
            if (this.imgCount) {
                this.imgCount++;
                this.$refs.upList.addImg(imgURL);
                return;
            }
            this.imgCount++;
            // 没有图片时，UploaderList不在dom中，这时上传第一张图片后，设个延时, 再访问this.$refs.upList
            this.$nextTick(() => {
                this.$refs.upList.addImg(imgURL);  
            });
        },
        onImgUploadSuccess2(imgURL) {
            this.imgCount++;
        },
        onImgRemove() {
            this.imgCount--;
        },
        onSuccess() {
            this.$emit('success');
        },
        onError() {

        },
        onBoilingPointSubmit() {
            if (this.isSaving) {
                return;
            }
            this.isSaving = true;
            const imgs = this.imgCount ? this.$refs.upList.getImgs() : [];
            const reqData = {
                htmlContent: this.$refs.richEditor.getHTML(),
                imgs: imgs && imgs.length ? imgs : undefined,
            };
            myHTTP.post('/boilingpoints', reqData).then((res) => {
                this.isSaving = false;
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.$emit('publish', res.data.data);
                }
            }).catch((err) => {
                this.isSaving = false;    
            });
        }
    },
    components: {
        CommentRichEditor,
        UploaderList,
    }
}
</script>

<style lang="scss" scoped>
.no-img-box {
    border-radius: 0;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    background: #f9fafb;
    border: 1px solid #dcdcdc;
    border-top: 0;
    height: 30px;
}
</style>