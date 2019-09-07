<template>
    <CommentRichEditor ref="richEditor"
        placeholder="placeholder"
        editorType="boilingpoint"
        :uploadAllowed="uploadAllowed"
        :emptyPlaceholder="placeholder || '发布动态'" @success="onSuccess"
        @error="onError" @imgUploadSuccess="onImgUploadSuccess"
        @topicSelected="onTopicSelected"
        @boilingPointSubmit="onBoilingPointSubmit"
        :sendDefVisible="true">
        <div class="custom-box" slot="upload-list">
            <UploaderList v-if="imgCount" :uploadAllowed="uploadAllowed" ref="upList" @success="onImgUploadSuccess2" @remove="onImgRemove"></UploaderList>
            <div class="cur-topic">
                <span v-if="topic && topic.name" class="cur-topic-title">{{topic.name}}</span>
                <span class="word-counter">
                    <span>1000</span>
                </span>
            </div>
        </div>
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
            topic: null,
        };
    },
    computed: {
        uploadAllowed() {
            return this.imgCount < 9;
        }
    },
    methods: {
        onImgUploadSuccess(imgURL, imgData) {
            console.log('---------------', imgURL, imgData);
            if (this.imgCount) {
                this.imgCount++;
                this.$refs.upList.addImg(imgData);
                return;
            }
            this.imgCount++;
            // 没有图片时，UploaderList不在dom中，这时上传第一张图片后，设个延时, 再访问this.$refs.upList
            this.$nextTick(() => {
                this.$refs.upList.addImg(imgData);
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
        onTopicSelected(topic) {
            this.topic = topic;
        },
        onBoilingPointSubmit() {
            if (this.isSaving) {
                return;
            }
            this.isSaving = true;
            const imgDataArr = this.imgCount ? this.$refs.upList.getAllImgData() : [];
            const imgIDs = imgDataArr.map(imgData => imgData.id);
            const reqData = {
                topicID: this.topic && this.topic.id || undefined,
                htmlContent: this.$refs.richEditor.getHTML(),
                imgs: imgIDs.length ? imgIDs : undefined,
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
.custom-box {
    border-radius: 0;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    background: #f9fafb;
    border: 1px solid #dcdcdc;
    border-top: 0;
    min-height: 30px;   
    padding-bottom: 8px;
}

.custom-box .cur-topic {
    padding-left: 15px;
    height: 30px;
    line-height: 30px;
}

.custom-box .cur-topic-title {
    font-size: 13px;
    display: inline-block;
    line-height: 22px;
    height: 22px;
    padding: 0 12px;
    border: 1px solid #007fff;
    border-radius: 14px;
    text-align: center;
    color: #007fff;
    user-select: none;
}

.custom-box .word-counter {
    font-size: 13px;
    user-select: none;
    pointer-events: none;
    float: right;
    color: #a1a9b3;
    padding-right: 0;
    height: 30px;
    position: relative;
}

.custom-box .word-counter span {
    position: absolute;
    right: 15px;
    top: 12px;
    line-height: normal;
}
</style>