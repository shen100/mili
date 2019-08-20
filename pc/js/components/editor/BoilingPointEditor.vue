<template>
    <CommentRichEditor ref="richEditor"
        editorType="boilingpoint"
        :uploadAllowed="uploadAllowed"
        emptyPlaceholder="发布动态" @success="onSuccess"
        @error="onError" @imgUploadSuccess="onImgUploadSuccess"
        :sendDefVisible="true">
        <UploaderList :uploadAllowed="uploadAllowed" ref="upList" @success="onImgUploadSuccess2" @remove="onImgRemove" slot="upload-list"></UploaderList>
    </CommentRichEditor>
</template>

<script>
import CommentRichEditor from '~/js/components/editor/CommentRichEditor.vue';
import UploaderList from '~/js/components/common/UploaderList.vue';

export default {
    data() {
        return {
            imgCount: 0,
        };
    },
    computed: {
        uploadAllowed() {
            return this.imgCount < 1;
        }
    },
    methods: {
        onImgUploadSuccess(imgURL) {
            this.imgCount++;
            this.$refs.upList.addImg(imgURL);
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

        }
    },
    components: {
        CommentRichEditor,
        UploaderList,
    }
}
</script>