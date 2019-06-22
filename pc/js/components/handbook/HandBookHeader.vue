<template>
    <div class="editor-header">
        <ErrorTip ref="errorTip" />
        <input v-model="articleTitle" class="editor-title-input" type="text" placeholder="输入小册标题..." />
        <div class="user-actions-box">
            <UserDropdown :userID="userID" :avatarURL="avatarURL" menuAlign="right" />
            <div v-clickoutside="onClickOutsidePublishToggle" class="publish-popup">
                <div @click="onPublishToggle" class="toggle-btn">
                    <span class="publish-popup-btn">提交</span>
                    <i v-if="!publishToggled" class="fa fa-caret-down"></i>
                    <i v-else class="fa fa-caret-up"></i>
                </div>
                <div v-if="publishToggled" class="panel">
                </div>
            </div>
            <div v-clickoutside="onClickOutsideCoverToggle" class="upload-cover">
                <div v-if="!coverURL" @click="onCoverToggle" class="upload-cover-img"></div>
                <div v-else @click="onCoverToggle" class="upload-cover-img2"></div>
                <div v-if="coverToggled" class="panel">
                    <div class="title">添加小册封面</div>
                    <div class="book-img-size">建议650*910（png格式）</div>
                    <Uploader v-show="!isCoverUploading && !coverURL" style="width: 100%;" 
                        @uploading="onImgUploading"
                        @success="onImgUploadSuccess" @error="onImgUploadFail">
                        <div class="cover-area"></div>
                    </Uploader>
                    <div v-show="!isCoverUploading && coverURL" class="cover-img-area">
                        <img :src="coverURL" />
                        <button @click="onRemoveCover" title="移除这张图片" class="delete-cover-btn">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="auto-save">{{autoSaveDraftTip}}<a>存草稿</a></div>
        </div>
    </div>
</template>

<script>
import UserDropdown from '~/js/components/common/UserDropdown.vue';
import Uploader from '~/js/components/common/Uploader.vue';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import Alert from '~/js/components/common/Alert.vue';
import { ArticleContentType } from '~/js/constants/article.js';
import { ErrorCode } from '~/js/constants/error.js';
import { myHTTP } from '~/js/common/net.js';
import { trim } from '~/js/utils/utils.js';
import { isContentEmpty } from '~/js/utils/dom.js';

export default {
    props: [
        'userID',
        'avatarURL',
        'title',
        'getEditorMarkdown',
    ],
    data () {
        return {
            articleTitle: '',
            coverURL: '',
            isCoverUploading: false, // 是否正在上传文章封面图片
            coverToggled: false,
            publishToggled: false,
            autoSaveDraftTip: '文章将自动保存至草稿',
        }
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        getContent() {
            return this.getEditorMarkdown();
        },
        onPublish() {
        },
        onRemoveCover() {
            this.coverURL = '';
        },
        onImgUploading() {
            this.coverURL = '';
            this.isCoverUploading = true;
        },
        onImgUploadSuccess(imgURL) {
            this.coverURL = imgURL;
            this.isCoverUploading = false;
        },
        onImgUploadFail(message) {
            this.coverURL = '';
            this.$refs.errorTip.show(message);
            this.isCoverUploading = false;
        },
        onCoverToggle() {
            this.coverToggled = !this.coverToggled;
        },
        onClickOutsideCoverToggle() {
            this.coverToggled = false;
        },
        onClickOutsideMarkdownToggle() {
            this.markdownToggled = false;
        },
        onPublishToggle() {
            this.publishToggled = !this.publishToggled;
        },
        onClickOutsidePublishToggle() {
            this.publishToggled = false;
        }
    },
    components: {
        UserDropdown,
        Uploader,
        ErrorTip,
        Alert,
    }
}
</script>

<style scoped>
    .upload-cover .panel:before {
        right: 104px;
    }

    .upload-cover .panel {
        width: 230px;
        margin-right: -93px;
    }

    .panel .title {
        font-size: 18px;
        color: #333;
        margin-bottom: 10px;
    }

    .book-img-size {
        color: #8f9193;
        margin-bottom: 8px;
    }

    .cover-area {
        width: 180px;
        height: 250px;
        font-size: 14px;
        color: rgba(51, 51, 51, .4);
        background-image: url(../../../images/handbook/poster-cover.png);
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: contain;
        border-radius: 0;
        border: none;
        outline: none;
        cursor: pointer;
    }

    .cover-img-area {
        width: 180px;
        height: 250px;   
    }

    .cover-img-area img {
        width: 100%;
        height: 100%;
        -o-object-fit: cover;
        object-fit: cover;
    }
</style>
