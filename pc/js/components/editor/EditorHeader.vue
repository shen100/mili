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
                <div v-if="publishToggled && this.categories.length" class="panel">
                    <div class="title">{{isEditArticle ? '更新': '发布'}}文章</div>
                    <div class="category-box">
                        <div class="sub-title">分类</div>
                        <div class="category-list">
                            <div @click="onSelectCategory(c)" :key="c.id" v-for="c in categories" 
                                :class="{active: curCategory && curCategory.id === c.id}" class="item">{{c.name}}</div>
                        </div>
                    </div>
                    <div class="tag-box category-box">
                        <div class="sub-title" :style="{'margin-bottom': curTag ? '10px' : '2px'}">标签</div>
                        <div v-show="curTag" class="user-category-list">
                            <div @click="onCancelSelectTag" class="item">{{curTag && curTag.name}}</div>
                        </div>
                        <div v-show="!curTag" class="tag-input tag-input">
                            <input @input="onSearchTagChange" v-model="searchTagText" type="text" placeholder="选择分类中标签"/>
                            <ul v-if="!isSearchTagTextEmpty && tags.length" class="suggested-tag-list">
                                <li @click.stop="onSelectTagChange(t)" :key="t.id" v-for="t in tags">{{t.name}}</li>
                            </ul>
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
        'isRich', // 是否使用的是富文本编辑器
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
        'initialCategories', // 数组，每个元素是对象
        'initialTags' // 数组，每个元素是对象
    ],
    data () {
        return {
            isEditDraft: !!this.draftID, // 有draftID时，是编辑草稿(draftID 和 articleID 不会同时存在)
            isEditArticle: !!this.articleID, // 有articleID时，是编辑文章(draftID 和 articleID 不会同时存在)
            articleTitle: !this.isRich ? this.title : '', // Markdown 编辑器时，才在 header 中显示标题
            coverURL: '',
            isCoverUploading: false, // 是否正在上传文章封面图片
            coverToggled: false,
            publishToggled: false,
            markdownToggled: false,
            curCategory: null, // 当前选中的分类
            categories: [], // 所有的分类， 每个元素是对象
            curTag: null, // 当前选中的标签
            tags: [], // 搜索出的标签, 每个元素是对象
            searchTagText: '',
            lastLoadTagsTime: 0, // 上一次搜索标签，发请求时的时间
            switchEditorAlertVisible: false,
            switchEditorAlertText: '切换编辑器后，当前内容不会迁移，但会自动保存为草稿。',
            autoSaveDraftTip: '文章将自动保存至草稿',
            // 先使用 autoSaveTimeArr 中的时间点自动保存，如果时间太长，autoSaveTimeArr中的时间点用完了，
            // 这时，再使用 defaultAutoSaveTime 时间间隔来保存
            autoSaveTimeArr: window.env === 'development' ? [2] : [10, 30, 60, 2 * 60, 3 * 60],
            defaultAutoSaveTime: window.env === 'development' ? 2 : 3 * 60,
            isDraftSaving: false, // 是否正在保存文章草稿
            autoSaveDraftTimeoutID: 0,
            autoSaveCount: 0, // 第几次自动保存
            lastSaveDraftTitle: '',
            lastSaveDraftContent: '',
            lastSaveCategoryID: undefined,
            lastSaveTagID: undefined,
            lastSaveCoverURL: '',
        };
    },
    mounted() {
        if (this.isEditArticle || this.isEditDraft) {
            if (this.initialCategories && this.initialCategories.length) {
                // 目前只支持选择一个分类
                this.curCategory = this.initialCategories[0];
            }
            if (this.initialTags && this.initialTags.length) {
                // 目前只支持选择一个标签
                this.curTag = this.initialTags[0];
            }
        }

        // 请求所有的分类
        const url = '/categories';
        myHTTP.get(url).then((result) => {
            this.categories = result.data.data || [];
        });

        this.autoSaveDraftTimeoutID = setTimeout(this.autoSaveDraft, 1000 * this.getAutoSaveTime());
    },
    computed: {
        isSearchTagTextEmpty() {
            return !!trim(this.searchTagText);
        },
    },
    methods: {
        autoSaveDraft() {
            this.autoSaveCount++;
            this.saveDraft();
            this.autoSaveDraftTimeoutID = setTimeout(this.autoSaveDraft, 1000 * this.getAutoSaveTime());
        },
        getAutoSaveTime() {
            return this.autoSaveTimeArr[this.autoSaveCount] || this.defaultAutoSaveTime;
        },
        saveDraft() {
            if (this.isDraftSaving) {
                return;
            }
            const articleTitle = trim(this.getTitle()) || '';
            const articleContent = this.getContent() || '';
            const cID = this.curCategory && this.curCategory.id || undefined;
            const tagID = this.curTag && this.curTag.id || undefined;
            const coverURL = this.coverURL || '';
            if (!articleTitle && isContentEmpty(articleContent, this.isRich ? 'rich' : 'md')) {
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
            if (isContentEmpty(this.articleContent, this.isRich ? 'rich' : 'md')) {
                this.$refs.errorTip.show('请输入正文');
                return;
            }
            if (!this.curCategory) {
                this.$refs.errorTip.show('请选择分类');
                return;
            }
            if (!this.curTag) {
                this.$refs.errorTip.show('请选择标签');
                return;
            }
            let url = '/articles';
            let reqMethod = myHTTP.post;
            const reqData = {
                name: this.articleTitle,
                content: this.articleContent,
                contentType: this.isRich ? ArticleContentType.HTML : ArticleContentType.Markdown,
                categories: [ { id: this.curCategory.id } ],
                tags: [ { id: this.curTag.id } ],
            };
            if (this.coverURL) {
                reqData.coverURL = this.coverURL;
            }
            // 创建文章、编辑草稿 最后都会跳到 文章发布成功的页面
            // 编辑文章，跳到文章详情页面
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
                    location.href = `/p/${this.articleID}`;
                    return;
                }
                location.href = `/editor/published`;
            });
        },
        onSelectCategory(category) {
            if (!this.curCategory || category.id !== this.curCategory.id) {
                this.curTag = null;
                this.tags = [];
            }
            this.curCategory = category;
        },
        onSelectTagChange(tag) {
            this.curTag = tag;
            this.tags = [];
            this.searchTagText = '';
        },
        onCancelSelectTag() {
            this.curTag = null;
        },
        onSearchTagChange() {
            this.$nextTick(() => {
                const queryText = trim(this.searchTagText);
                if (!queryText) {
                    return;
                }
                const lastLoadTagsTime = new Date().getTime();
                this.lastLoadTagsTime = lastLoadTagsTime;
                const url = `/tags/category/${this.curCategory.id}/search?q=` + encodeURIComponent(queryText);
                myHTTP.get(url).then((res) => {
                    if (lastLoadTagsTime < this.lastLoadTagsTime) {
                        return;
                    }
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        this.tags = res.data.data;
                    }
                }).catch(err => {
                    console.log(err);
                });
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
                categories: this.curCategory ? [ { id: this.curCategory.id } ] : null,
                tags: this.curTag ? [ { id: this.curTag.id } ] : null,
                editorType: this.isRich ? ArticleContentType.Markdown : ArticleContentType.HTML,
            };
            if (coverURL) {
                reqData.coverURL = coverURL;
            }
            myHTTP.post(url, reqData).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    location.href = '/editor/drafts/new';
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