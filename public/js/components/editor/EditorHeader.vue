<template>
    <div class="editor-header">
        <ErrorTip ref="errorTip" />
        <Alert ref="switchEditorAlert" width="450" 
            @ok="onSwitchEditorAlertOk" @cancel="onSwitchEditorAlertCancel" />
        <div class="editor-logo-box" :style="{width: `${logoBoxWidth}px` }"></div>
        <input v-if="!isRich" v-model="articleTitle" class="editor-title-input" type="text" placeholder="输入标题..." />
        <div v-else class="editor-no-header-title"></div>
        <div class="user-actions-box">
            <UserDropdown :userID="userID" :avatarURL="avatarURL" menuAlign="right" />
            <div v-clickoutside="onClickOutsidePublishToggle" class="publish-popup">
                <div @click="onPublishToggle" class="toggle-btn">
                    <span class="publish-popup-btn">{{isEditArticle ? '更新' : '发布'}}</span>
                    <i v-if="!publishToggled" class="fa fa-caret-down"></i>
                    <i v-else class="fa fa-caret-up"></i>
                </div>
                <div v-if="publishToggled" class="panel">
                    <div class="title">{{isEditArticle ? '更新': '发布'}}文章</div>
                    <div class="category-box">
                        <div class="sub-title">热门分类</div>
                        <div class="category-list">
                            <div @click="onSelectHotCategory(c.id)" :key="c.id" v-for="c in hotCategories" :class="{active: selectHotCategoryID === c.id}" class="item">{{c.name}}</div>
                        </div>
                    </div>
                    <div class="category-box">
                        <div class="sub-title" :style="{'margin-bottom': curSelectCategory ? '10px' : '2px'}">输入分类</div>
                        <div v-show="curSelectCategory" class="user-category-list">
                            <div @click="onCancelSelectCategory" class="item">{{curSelectCategory && curSelectCategory.name}}</div>
                        </div>
                        <div v-show="!curSelectCategory" class="tag-input tag-input">
                            <Select @on-change="onSelectCategoryChange" v-model="selectCategoryID" placeholder="输入1个分类"
                                filterable remote :remote-method="requestCategories" :loading="isLoadingCategory">
                                <Option v-for="c in categories" :value="c.id" :key="c.id">{{c.name}}</Option>
                            </Select>
                        </div>
                    </div>
                    <button @click="onPublish" class="publish-btn">确定并{{isEditArticle ? '更新' : '发布'}}</button>
                </div>
            </div>
            <div v-clickoutside="onClickOutsideMarkdownToggle" class="editor-more-btn">
                <i @click="onMarkdownToggle" class="iconfont ic-others"></i>
                <div v-if="markdownToggled" @click="switchEditor" class="switch-editor">切换为 {{switchEditorLabel}} 编辑器</div>
            </div>
            <div v-clickoutside="onClickOutsideCoverToggle" class="upload-cover">
                <div v-if="!coverURL" @click="onCoverToggle" class="upload-cover-img"></div>
                <div v-else @click="onCoverToggle" class="upload-cover-img2"></div>
                <div v-if="coverToggled" class="panel">
                    <div class="title">添加封面大图</div>
                    <div v-if="isCoverUploading" class="cover-area-uploading">封面设置中...</div>
                    <Uploader v-show="!isCoverUploading && !coverURL" style="width: 100%;" 
                        @uploading="onImgUploading"
                        @success="onImgUploadSuccess" @error="onImgUploadFail">
                        <div class="cover-area">点击此处添加图片</div>
                    </Uploader>
                    <div v-show="!isCoverUploading && coverURL" class="cover-img-area">
                        <img :src="coverURL" />
                        <button @click="onRemoveCover" title="移除这张图片" class="delete-cover-btn">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="auto-save">{{autoSaveDraftTip}}<a @click="saveDraft">存草稿</a></div>
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

export default {
    props: [
        'isRich',
        'logoBoxWidth',
        'userID',
        'avatarURL',
        'switchEditorLabel',
        'title',
        'getArticleTitle',
        'getEditorHTML',
        'getEditorMarkdown',
        'draftID',
        'articleID',
        'initialCategories'
    ],
    data () {
        return {
            isEditDraft: !!this.draftID, // 有draftID时，是编辑草稿(draftID和articleID不会同时存在)
            isEditArticle: !!this.articleID, // 有articleID时，是编辑文章(draftID和articleID不会同时存在)
            articleTitle: !this.isRich ? this.title : '',
            coverURL: '',
            isCoverUploading: false, // 是否正在上传文章封面图片
            coverToggled: false,
            publishToggled: false,
            markdownToggled: false,
            // 如果是编辑文章，或编辑草稿，那么会传分类(initialCategories)，用户选择分类后,
            // 再使用用户选择的分类，而不使用 initialCategories
            notUseInitialCategories: false,
            selectHotCategoryID: undefined,
            hotCategories: [],
            selectCategoryID: undefined,
            categories: [],
            isLoadingCategory: false,
            switchEditorAlertVisible: false,
            switchEditorAlertText: '切换编辑器后，当前内容不会迁移，但会自动保存为草稿。',
            lastQueryText: '',
            autoSaveDraftTip: '文章将自动保存至草稿',
            defaultAutoSaveTime: window.env === 'development' ? 10 : 5 * 60,
            autoSaveTimeArr: window.env === 'development' ? [10] : [10, 30, 60, 3 * 60, 5 * 60],
            isDraftSaving: false, // 是否正在保存文章草稿
            autoSaveDraftTimeoutID: 0,
            autoSaveCount: 0, // 第几次自动保存
            lastSaveDraftTitle: '',
            lastSaveDraftContent: '',
            lastSaveCategoryID: undefined,
            lastSaveCoverURL: ''
        }
    },
    mounted() {
        const url = '/categories/hot';
        myHTTP.get(url).then((result) => {
            this.hotCategories = result.data.data || [];
            const initialCategories = this.initialCategories;
            if ((this.isEditArticle || this.isEditDraft) && initialCategories && initialCategories.length) {
                // 目前只支持选择一个分类
                const category = this.initialCategories[0];
                for (let i = 0; i < this.hotCategories.length; i++) {
                    if (this.hotCategories[i].id === category.id) {
                        this.selectHotCategoryID = category.id;
                        return;
                    }
                }
                this.selectCategoryID = category.id;
            }
        });
        this.autoSaveDraftTimeoutID = setTimeout(this.autoSaveDraft, 1000 * this.getAutoSaveTime());
    },
    computed: {
        curSelectCategory: function() {
            if (!this.selectCategoryID) {
                return null;
            }
            // 编辑文章或编辑草稿时，会传initialCategories
            if (!this.notUseInitialCategories && this.initialCategories && this.initialCategories.length) {
                // 目前只支持选择一个分类
                return this.initialCategories[0];
            }
            for (let i = 0; i < this.categories.length; i++) {
                if (this.categories[i].id === this.selectCategoryID) {
                    return this.categories[i];
                }
            }
            return null;
        }
    },
    methods: {
        getAutoSaveTime() {
            return this.autoSaveTimeArr[this.autoSaveCount] || this.defaultAutoSaveTime;
        },
        saveDraft() {
            if (this.isDraftSaving) {
                return;
            }
            const articleTitle = trim(this.getTitle()) || '';
            const articleContent = this.getContent() || '';
            const cID = this.selectHotCategoryID || this.selectCategoryID || undefined;
            const coverURL = this.coverURL || '';
            if (!articleTitle && this.isContentEmpty(articleContent)) {
                return;
            }
            if (this.lastSaveDraftTitle === articleTitle && this.lastSaveDraftContent === articleContent
                && this.lastSaveCategoryID === cID && this.lastSaveCoverURL === coverURL) {
                return;
            }
            
            const url = '/editor/drafts';
            this.autoSaveDraftTip = '正自动保存至草稿...';
            this.isDraftSaving = true;
            const reqData = {
                name: articleTitle,
                content: articleContent,
                contentType: this.isRich ? ArticleContentType.HTML : ArticleContentType.Markdown,
                categories: cID ? [ { id: cID } ] : null
            };
            if (coverURL) {
                reqData.coverURL = coverURL;
            }
            myHTTP.post(url, reqData).then((res) => {
                this.isDraftSaving = false;
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.autoSaveDraftTip = '已保存至草稿';
                    this.lastSaveDraftTitle = articleTitle;
                    this.lastSaveDraftContent = articleContent;
                    this.lastSaveCategoryID = cID;
                    this.lastSaveCoverURL = coverURL;
                }
            }).catch((err) => {
                this.isDraftSaving = false;
            });
        },
        autoSaveDraft() {
            this.saveDraft();
            this.autoSaveCount++;
            this.autoSaveDraftTimeoutID = setTimeout(this.autoSaveDraft, 1000 * this.getAutoSaveTime());
        },
        getTitle() {
            if (this.isRich) {
                return this.getArticleTitle();
            }
            return this.articleTitle;
        },
        getContent() {
            if (this.isRich) {
                return this.getEditorHTML();
            }
            return this.getEditorMarkdown();
        },
        isContentEmpty(articleContent) {
            if (this.isRich) {
                if (!articleContent || articleContent === '<p></p>') {
                    return true;
                }
            } else {
                if (!articleContent) {
                    return true;
                }
            }
            return false;
        },
        onPublish() {
            this.articleTitle = trim(this.getTitle()) || '';
            this.articleContent = this.getContent();

            if (!this.articleTitle) {
                this.$refs.errorTip.show('请输入标题');
                return;
            }
            if (this.isContentEmpty(this.articleContent)) {
                this.$refs.errorTip.show('请输入正文');
                return;
            }
            const cID = this.selectHotCategoryID || this.selectCategoryID;
            if (!cID) {
                this.$refs.errorTip.show('请至少选择一个分类');
                return;
            }
            // 编辑草稿，点击发布，会创建文章
            let url = '/articles';
            let reqMethod = myHTTP.post;
            const reqData = {
                name: this.articleTitle,
                content: this.articleContent,
                contentType: this.isRich ? ArticleContentType.HTML : ArticleContentType.Markdown,
                categories: [ { id: cID } ],
            };
            if (this.coverURL) {
                reqData.coverURL = this.coverURL;
            }
            if (this.isEditArticle) {
                reqMethod = myHTTP.put;
                reqData.id = this.articleID;
            }
            reqMethod(url, reqData).then((res) => {
                const result = res.data;
                if (result.errorCode) {
                    this.$refs.errorTip.show(result.message);
                    return;
                }
                clearTimeout(this.autoSaveDraftTimeoutID);
                if (this.isEditArticle) {
                    location.href = `/p/${this.articleID}.html`;
                    return;
                }
                // 非编辑文章，那么就是直接创建文章，或编辑草稿，
                // 编辑草稿时，点击发布，同样是创建文章
                location.href = `/editor/published`;
            });
        },
        onCancelSelectCategory() {
            this.notUseInitialCategories = true;
            this.selectCategoryID = undefined;
        },
        onSelectHotCategory(id) {
            this.notUseInitialCategories = true;
            this.selectHotCategoryID = id;
            this.selectCategoryID = undefined;
            this.$nextTick(() => {
                // 下面这行代码不能去掉，对this.selectCategoryID赋值时，会调用onSelectCategoryChange
                // 然后又对 this.selectHotCategoryID 进行赋值
                this.selectHotCategoryID = id;
            });
        },
        onSelectCategoryChange() {
            this.notUseInitialCategories = true;
            this.selectHotCategoryID = undefined;
        },
        requestCategories(queryText) {
            queryText = trim(queryText);
            if (this.lastQueryText === queryText) {
                return;
            }
            this.lastQueryText = queryText;
            if (!queryText) {
                return;
            }
            this.isLoadingCategory = true;
            const url = `/categories/search?name=${encodeURIComponent(queryText)}`;
            myHTTP.get(url).then((result) => {
                this.categories = result.data.data;
                this.isLoadingCategory = false;
            }).catch((err) => {
                this.isLoadingCategory = false;
            });
        },
        switchEditor() {
            this.$refs.switchEditorAlert.show(`切换为${this.switchEditorLabel}编辑器`, this.switchEditorAlertText);
            this.markdownToggled = false;
        },
        onSwitchEditorAlertOk() {
            const articleTitle = trim(this.getTitle());
            const articleContent = this.getContent();
            const cID = this.selectHotCategoryID || this.selectCategoryID;
            const coverURL = this.coverURL;
            const url = '/editor/switch';
            const reqData = {
                name: articleTitle,
                content: articleContent,
                contentType: this.isRich ? ArticleContentType.HTML : ArticleContentType.Markdown,
                categories: cID ? [ { id: cID } ] : null,
                editorType: this.isRich ? ArticleContentType.Markdown : ArticleContentType.HTML,
            };
            if (coverURL) {
                reqData.coverURL = coverURL;
            }
            myHTTP.post(url, reqData).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    location.href = '/editor/drafts/new.html';
                }
            }).catch((err) => {

            });
        },
        onSwitchEditorAlertCancel() {
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
        onMarkdownToggle() {
            this.markdownToggled = !this.markdownToggled;
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