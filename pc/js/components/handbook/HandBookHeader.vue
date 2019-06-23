<template>
    <div class="editor-header">
        <ErrorTip ref="errorTip" />
        <AgreementAlert ref="agreementAlert" width="556" />
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
                    <div class="title">更新</div>
                    <div class="summary-box">
                        <div class="sub-title">摘要</div>
                        <textarea placeholder="必填，摘要将显示在小册详情页标题的下方，建议 50 字以内" max-length="50" class="summary-textarea"></textarea>
                    </div>
                    <div class="price-box">
                        <div class="sub-title">
                            <span>作者简介</span>
                        </div>
                        <input type="text" :placeholder="`公司+职位，如：${siteName}创始人`" class="price-input">
                    </div>
                    <div class="price-box">
                        <div class="sub-title">
                            <span>小册价格</span>
                            <span class="quarterly-earnings">!</span>
                        </div>
                        <input type="number" placeholder="输入价格，例：99，不填写则为免费" class="price-input">
                    </div>
                    <div class="price-box">
                        <div class="sub-title">
                            <span>小册完成时间</span>
                        </div>
                        <div>
                            <DatePicker type="date" placeholder="请选择日期" style="width: 286px;"></DatePicker>
                        </div>
                    </div>
                    <label class="line-confirmation">
                        <input type="checkbox">
                        <div class="txt">
                            <span>我已阅读同意</span>
                            <span @click="onShowAgreement" class="agreement">《{{siteName}}小册写作线上协议》</span>
                        </div>
                    </label>
                    <label class="line-confirmation">
                        <input type="checkbox">
                        <div class="txt">
                            <span>所有章节已完成</span>
                        </div>
                    </label>
                    <button class="publish-btn handbook-publish">确定并更新</button>
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
import { DatePicker } from 'iview';
import UserDropdown from '~/js/components/common/UserDropdown.vue';
import Uploader from '~/js/components/common/Uploader.vue';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import Alert from '~/js/components/common/Alert.vue';
import AgreementAlert from '~/js/components/handbook/AgreementAlert.vue';
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
            siteName: window.siteName,
            articleTitle: '',
            coverURL: '',
            isCoverUploading: false, // 是否正在上传文章封面图片
            coverToggled: false,
            publishToggled: false,
            autoSaveDraftTip: '文章将自动保存至草稿',
        };
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
        },
        onShowAgreement() {
            this.$refs.agreementAlert.show();
        }
    },
    components: {
        UserDropdown,
        Uploader,
        ErrorTip,
        Alert,
        DatePicker,
        AgreementAlert,
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

    .panel .title {
        margin-bottom: 18px;
        font-size: 18px;
        font-weight: 700;
        color: #333;
    }

    .panel .summary-box {
        margin-bottom: 12px;
    }

    .panel .sub-title {
        margin-bottom: 12px;
        font-size: 16px;
        color: #333;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
    }

    .panel .summary-box .summary-textarea {
        width: 100%;
        height: 90px;
        line-height: 18px;
        padding: 8px;
        resize: none;
        outline: none;
        border: 1px solid #ccc;
        overflow: auto;
        font-size: 14px;
        color: #000;
    }

    .panel .summary-box .summary-textarea::-webkit-input-placeholder {
        color: #888;
    }

    .panel .price-box {
        margin-bottom: 20px;
    }

    .panel .price-box .sub-title {
        margin-bottom: 8px;
    }

    .panel .price-box .price-input {
        padding-left: 10px;
        width: 100%;
        height: 40px;
        outline: none;
        border: 1px solid #ccc;
        overflow: visible;
        font-size: 14px;
    }

    .panel .price-box .price-input::-webkit-input-placeholder {
        color: #888;
    }

    .panel .sub-title .quarterly-earnings {
        width: 16px;
        height: 16px;
        border: 1px solid #007fff;
        color: #007fff;
        text-align: center;
        line-height: 16px;
        border-radius: 50%;
        font-size: 12px;
        font-weight: 700;
        margin-left: 5px;
        cursor: pointer;
    }

    .panel input:focus, .panel textarea:focus {
        border: 1px solid #007fff!important;
    }

    .panel .line-confirmation {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        cursor: pointer;
        margin-bottom: 5px;
        color: #000;
    }

    .panel .line-confirmation input {
        margin-right: 5px;
    }

    [type=checkbox], [type=radio] {
        box-sizing: border-box;
        padding: 0;
    }

    .panel .line-confirmation .agreement {
        color: #007fff;
        text-decoration: none;
    }

    .panel .handbook-publish {
        margin-top: 20px;
        font-size: 14px;
        padding: 7px 14px!important;
    }
</style>
