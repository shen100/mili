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
                        <div class="sub-title">分类</div>
                        <div class="category-list">
                            <div @click="onSelectCategory(c.id)" :key="c.id" v-for="c in categories" :class="{active: categoryID === c.id}" class="item">{{c.name}}</div>
                        </div>
                    </div>
                    <div class="tag-box category-box">
                        <div class="sub-title" :style="{'margin-bottom': curSelectTag ? '10px' : '2px'}">标签</div>
                        <div v-show="curSelectTag" class="user-category-list">
                            <div @click="onCancelSelectTag" class="item">{{curSelectTag && curSelectTag.name}}</div>
                        </div>
                        <div v-show="!curSelectTag" class="tag-input tag-input">
                            <Select @on-change="onSelectTagChange" v-model="tagID" placeholder="添加1个标签"
                                filterable remote :remote-method="requestTags" :loading="isLoadingTag">
                                <Option v-for="t in tags" :value="t.id" :key="t.id">{{t.name}}</Option>
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
import { isContentEmpty } from '~/js/utils/dom.js';

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
        'initialCategories',
        'initialTags'
    ],
    data () {
        return {
            isEditDraft: !!this.draftID, // 有draftID时，是编辑草稿(draftID 和 articleID 不会同时存在)
            isEditArticle: !!this.articleID, // 有articleID时，是编辑文章(draftID 和 articleID 不会同时存在)
            articleTitle: !this.isRich ? this.title : '',
            coverURL: '',
            isCoverUploading: false, // 是否正在上传文章封面图片
            coverToggled: false,
            publishToggled: false,
            markdownToggled: false,
            // 如果是编辑文章，或编辑草稿，那么会传分类、标签(initialCategories、initialTags)，用户选择分类、标签后,
            // 再使用用户选择的分类、标签，而不使用 initialCategories、initialTags
            notUseInitialCategories: false,
            notUseInitialTags: false,
            categoryID: undefined,
            categories: [],
            tagID: undefined,
            tags: [],
            isLoadingTag: false,
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
            lastSaveTagID: undefined,
            lastSaveCoverURL: ''
        }
    },
    mounted() {
        if (this.isEditArticle || this.isEditDraft) {
            if (this.initialCategories && this.initialCategories.length) {
                // 目前只支持选择一个分类
                this.categoryID = this.initialCategories[0].id;
            }
            if (this.initialTags && this.initialTags.length) {
                // 目前只支持选择一个标签
                this.tagID = this.initialTags[0].id;
            }
        }
        const url = '/categories';
        myHTTP.get(url).then((result) => {
            this.categories = result.data.data || [];
        });
        this.autoSaveDraftTimeoutID = setTimeout(this.autoSaveDraft, 1000 * this.getAutoSaveTime());
    },
    computed: {
        curSelectTag: function() {
            if (!this.tagID) {
                return null;
            }
            // 编辑文章或编辑草稿时，会传initialTags
            if (!this.notUseInitialTags && this.initialTags && this.initialTags.length) {
                // 目前只支持添加一个标签
                return this.initialTags[0];
            }
            for (let i = 0; i < this.tags.length; i++) {
                if (this.tags[i].id === this.tagID) {
                    return this.tags[i];
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
            const cID = this.categoryID || undefined;
            const tagID = this.tagID || undefined;
            const coverURL = this.coverURL || '';
            if (!articleTitle && isContentEmpty(articleContent, this.isRich)) {
                return;
            }
            if (this.lastSaveDraftTitle === articleTitle && this.lastSaveDraftContent === articleContent
                && this.lastSaveCategoryID === cID && this.lastSaveTagID === tagID
                && this.lastSaveCoverURL === coverURL) {
                return;
            }
            
            const url = '/editor/drafts';
            this.autoSaveDraftTip = '正自动保存至草稿...';
            this.isDraftSaving = true;
            const reqData = {
                name: articleTitle,
                content: articleContent,
                contentType: this.isRich ? ArticleContentType.HTML : ArticleContentType.Markdown,
                categories: cID ? [ { id: cID } ] : null,
                tags: tagID ? [ { id: tagID } ] : null,
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
                    this.lastSaveTagID = tagID;
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
        onPublish() {
            this.articleTitle = trim(this.getTitle()) || '';
            this.articleContent = this.getContent();

            if (!this.articleTitle) {
                this.$refs.errorTip.show('请输入标题');
                return;
            }
            if (isContentEmpty(this.articleContent, this.isRich)) {
                this.$refs.errorTip.show('请输入正文');
                return;
            }
            if (!this.categoryID) {
                this.$refs.errorTip.show('请选择分类');
                return;
            }
            if (!this.tagID) {
                this.$refs.errorTip.show('请添加标签');
                return;
            }
            let url = '/articles';
            let reqMethod = myHTTP.post;
            const reqData = {
                name: this.articleTitle,
                content: this.articleContent,
                contentType: this.isRich ? ArticleContentType.HTML : ArticleContentType.Markdown,
                categories: [ { id: this.categoryID } ],
                tags: [ { id: this.tagID } ],
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
                // 非编辑文章，那么就是直接创建文章，或编辑草稿后点击发布，同样也会创建文章
                location.href = `/editor/published.html`;
            });
        },
        onSelectCategory(id) {
            this.notUseInitialCategories = true;
            this.categoryID = id;
        },
        onSelectTagChange() {
            this.notUseInitialTags = true;
        },
        onCancelSelectTag() {
            this.notUseInitialTags = true;
            this.tagID = undefined;
        },
        requestTags(queryText) {
            queryText = trim(queryText);
            if (this.lastQueryText === queryText) {
                return;
            }
            this.lastQueryText = queryText;
            if (!queryText) {
                return;
            }
            this.isLoadingTag = true;
            const url = `/tags/search?q=${encodeURIComponent(queryText)}`;
            myHTTP.get(url).then((result) => {
                this.tags = result.data.data || [];
                this.isLoadingTag = false;
            }).catch((err) => {
                this.isLoadingTag = false;
            });
        },
        switchEditor() {
            this.$refs.switchEditorAlert.show(`切换为${this.switchEditorLabel}编辑器`, this.switchEditorAlertText);
            this.markdownToggled = false;
        },
        onSwitchEditorAlertOk() {
            const articleTitle = trim(this.getTitle());
            const articleContent = this.getContent();
            const coverURL = this.coverURL;
            const url = '/editor/switch';
            const reqData = {
                name: articleTitle,
                content: articleContent,
                contentType: this.isRich ? ArticleContentType.HTML : ArticleContentType.Markdown,
                categories: this.categoryID ? [ { id: this.categoryID } ] : null,
                tags: this.tagID ? [ { id: this.tagID } ] : null,
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