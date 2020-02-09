<template>
    <div class="editor-header">
        <ErrorTip ref="errorTip" />
        <AgreementAlert ref="agreementAlert" @cancel="onAgreementAlertCancel" width="556" />
        <PriceAlert ref="priceAlert" @cancel="onPriceAlertCancel" width="500" />
        <input v-model="name" class="editor-title-input" type="text" placeholder="输入小册标题..." />
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
                        <textarea v-model="summary" placeholder="必填，摘要将显示在小册详情页标题的下方，建议 50 字以内" max-length="50" class="summary-textarea"></textarea>
                    </div>
                    <div class="price-box">
                        <div class="sub-title">
                            <span>作者简介</span>
                        </div>
                        <input v-model="authorIntro" type="text" :placeholder="`公司+职位，如：${siteName}创始人`" class="price-input">
                    </div>
                    <div class="price-box">
                        <div class="sub-title">
                            <span>小册价格</span>
                            <span @click="onShowPriceAlert" class="quarterly-earnings">!</span>
                        </div>
                        <div class="price-input-number">
                            <InputNumber placeholder="输入价格，如9.99元，不填写则为免费" :step="0.01" :max="100000000" :min="0" v-model="price"></InputNumber>
                        </div>
                    </div>
                    <div class="price-box">
                        <div class="sub-title">
                            <span>小册完成时间</span>
                        </div>
                        <div>
                            <DatePicker @on-change="onDateChange" :value="completionAt" :clearable="false" type="date" placeholder="请选择日期" style="width: 286px;"></DatePicker>
                        </div>
                    </div>
                    <label class="line-confirmation">
                        <input v-model="isAgree" type="checkbox">
                        <div class="txt">
                            <span>我已阅读同意</span>
                            <span @click="onShowAgreement" class="agreement">《{{siteName}}小册写作线上协议》</span>
                        </div>
                    </label>
                    <label class="line-confirmation">
                        <input v-model="isAllDone" type="checkbox">
                        <div class="txt">
                            <span>所有章节已完成, 申请发布到线上</span>
                        </div>
                    </label>
                    <button @click="onFinalPublish" class="publish-btn handbook-publish">确定并更新</button>
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
        </div>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import UserDropdown from '~/js/components/common/UserDropdown.vue';
import Uploader from '~/js/components/common/Uploader.vue';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import Alert from '~/js/components/common/Alert.vue';
import AgreementAlert from '~/js/components/handbook/AgreementAlert.vue';
import PriceAlert from '~/js/components/handbook/PriceAlert.vue';
import { ArticleContentType } from '~/js/constants/article.js';
import { trim } from '~/js/utils/utils.js';

export default {
    props: [
        'isContentSaved',
        'userID',
        'avatarURL',
        'siteName'
    ],
    data () {
        const theData = {
            id: undefined,
            name: '',
            summary: '',
            authorIntro: '',
            price: 0,
            completionAt: null,
            isAgree: false,
            isAllDone: false,
            coverURL: '',
            isCoverUploading: false, // 是否正在上传封面图片
            coverToggled: false,
            publishToggled: false,
        };
        console.log(theData);
        return theData;
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        setHandBook(handbook) {
            this.id = handbook.id;
            this.name = handbook.name || '';
            this.summary = handbook.summary;
            this.authorIntro = handbook.authorIntro;
            this.price = handbook.price ? handbook.price / 100 : null;
            this.completionAt = handbook.completionAt ? new Date(handbook.completionAt) : null;
            this.isAgree = !!handbook.isAgree;
            this.isAllDone = !!handbook.isAllDone;
            this.coverURL = handbook.coverURL;
        },
        onDateChange(date) {
            this.completionAt = new Date(date);
        },
        onFinalPublish() {
            if (this.isAllDone) {
                if (!this.name) {
                    this.$refs.errorTip.show('小册标题不能为空');
                    return;
                }
                if (!this.summary) {
                    this.$refs.errorTip.show('摘要不能为空');
                    return;
                }
                if (!this.authorIntro) {
                    this.$refs.errorTip.show('作者简介不能为空');
                    return;
                }
            }

            if (!this.isAgree) {
                this.$refs.errorTip.show('请先同意小册写作线上协议');
                return;
            }

            if (!this.completionAt) {
                this.$refs.errorTip.show('请选择小册完成时间');
                return;
            }

            this.isContentSaved((result) => {
                if (!result) {
                    this.$refs.errorTip.show('没有网络连接，请稍后重试');
                    return;
                }
                const url = `/handbooks/${this.id}/commit`;
                myHTTP.put(url, {
                    name: this.name || '',
                    summary: this.summary || '',
                    authorIntro: this.authorIntro || '',
                    price: this.price && 100 * this.price || 0,
                    completionAt: this.completionAt && this.completionAt.getTime() || undefined,
                    isAgree: this.isAgree,
                    isAllDone: this.isAllDone,
                    coverURL: this.coverURL || '',
                }).then(function(res) {
                    const result = res.data;
                    if (result.errorCode === ErrorCode.SUCCESS.CODE) {

                    }
                });
            });
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
        },
        onShowPriceAlert() {
            this.$refs.priceAlert.show();
        },
        onAgreementAlertCancel() {
            // 此时 onClickOutsidePublishToggle 也会执行，设个延时，把发布的面板再次显示出来
            setTimeout(() => {
                this.publishToggled = true;
            }, 30);
            setTimeout(() => {
                this.publishToggled = true;
            }, 60);
            setTimeout(() => {
                this.publishToggled = true;
            }, 90);
        },
        onPriceAlertCancel() {
            // 此时 onClickOutsidePublishToggle 也会执行，设个延时，把发布的面板再次显示出来
            setTimeout(() => {
                this.publishToggled = true;
            }, 30);
            setTimeout(() => {
                this.publishToggled = true;
            }, 60);
            setTimeout(() => {
                this.publishToggled = true;
            }, 90);
        }
    },
    components: {
        UserDropdown,
        Uploader,
        ErrorTip,
        Alert,
        AgreementAlert,
        PriceAlert,
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
