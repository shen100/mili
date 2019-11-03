<template>
    <CommentRichEditor ref="richEditor"
        source="createboilingpoint"
        :maxWords="maxWords"
        :uploadAllowed="uploadAllowed"
        :emptyPlaceholder="placeholder || '发布沸点'" @submit="onSubmit"
        @error="onError" @imgUploadSuccess="onImgUploadSuccess"
        @topicSelected="onTopicSelected"
        @focus="onFocus" @blur="onBlur" @update="onUpdate">
        <div class="custom-box" :class="{'custom-box-focus': isFocus}" slot="upload-list">
            <UploaderList v-if="imgCount" :uploadAllowed="uploadAllowed" ref="upList" @success="onImgUploadSuccess2" @remove="onImgRemove"></UploaderList>
            <div class="cur-topic">
                <span v-if="topic && topic.name" class="cur-topic-title">{{topic.name}}</span>
                <span class="word-counter">
                    <span :style="{color: remainingWords < 0 ? '#ee0909' : '#a1a9b3'}">{{remainingWords}}</span>
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
import { trim } from '~/js/utils/utils.js';

export default {
    props: [
        'placeholder'
    ],
    data() {
        return {
            imgCount: 0,
            topic: null,
            isFocus: false,
            maxWords: 1000,
            remainingWords: 1000,
        };
    },
    computed: {
        uploadAllowed() {
            // 九宫格，最多只能上传9张图片
            return this.imgCount < 9;
        }
    },
    methods: {
        // CommentRichEditor 中上传的图片
        onImgUploadSuccess(imgURL, imgData) {
            if (this.imgCount) {
                this.imgCount++;
                this.$refs.upList.addImg(imgData);
                return;
            }
            this.imgCount++;
            // 一张图片没上传时，UploaderList不在dom中，这时上传第一张图片后，设个延时, 再访问this.$refs.upList
            this.$nextTick(() => {
                this.$refs.upList.addImg(imgData);
            });
        },
        // UploaderList 组件中上传的图片
        onImgUploadSuccess2(imgURL) {
            this.imgCount++;
        },
        onImgRemove() {
            this.imgCount--;
        },
        onTopicSelected(topic) {
            this.topic = topic;
        },
        onFocus() {
            this.isFocus = true;
        },
        onBlur() {
            this.isFocus = false;
        },
        onUpdate(data) {
            this.remainingWords = data.remainingWords;
        },
        onError(message) {
            this.$emit('error', message);
        },
        // 沸点发布
        onSubmit() {
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
                    this.$emit('success', res.data.data);
                    this.clear();
                }
            }).catch((err) => {
                this.isSaving = false;    
            });
        },
        clear() {
            this.imgCount = 0;
            this.topic = null;
            this.remainingWords = this.maxWords;
            this.$refs.upList && this.$refs.upList.clear();
            this.$refs.richEditor.setHTML('<p></p>');
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

.custom-box-focus {
    border-color: #ea6f5a;
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
    border: 1px solid #ea6f5a;
    border-radius: 14px;
    text-align: center;
    color: #ea6f5a;
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