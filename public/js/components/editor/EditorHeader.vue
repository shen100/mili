<template>
    <div class="editor-header">
        <ErrorTip ref="errorTip" />
        <Alert ref="switchEditorAlert" width="450" 
            @ok="onSwitchEditorAlertOk" @cancel="onSwitchEditorAlertCancel" />
        <div class="editor-logo-box" :style="{width: `${logoBoxWidth}px` }"></div>
        <input v-if="!isRich" v-model="articleTitle" class="editor-title-input" type="text" placeholder="输入标题..." />
        <div v-else class="editor-no-header-title"></div>
        <div class="user-actions-box">
            <NavUser :userID="userID" :avatarURL="avatarURL" menuAlign="right" />
            <div v-clickoutside="onClickOutsidePublishToggle" class="publish-popup">
                <div @click="onPublishToggle" class="toggle-btn">
                    <span class="publish-popup-btn">发布</span>
                    <i v-if="!publishToggled" class="fa fa-caret-down"></i>
                    <i v-else class="fa fa-caret-up"></i>
                </div>
                <div v-if="publishToggled" class="panel">
                    <div class="title">发布文章</div>
                    <div class="category-box">
                        <div class="sub-title">热门分类</div>
                        <div class="category-list">
                            <div @click="onSelectHotCategory(c.id)" :key="i" v-for="(c, i) in hotCategories" :class="{active: selectHotCategoryID === c.id}" class="item">{{c.name}}</div>
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
                                <Option v-for="(c, i) in categories" :value="c.id" :key="i">{{c.name}}</Option>
                            </Select>
                        </div>
                    </div>
                    <button @click="onPublish" class="publish-btn">确定并发布</button>
                </div>
            </div>
            <div v-clickoutside="onClickOutsideMarkdownToggle" class="editor-more-btn">
                <i @click="onMarkdownToggle" class="iconfont ic-others"></i>
                <div v-if="markdownToggled" @click="switchEditor" class="switch-editor">切换为 {{editorTypeLabel}} 编辑器</div>
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
            <div class="auto-save">文章将会自动保存至<a href="/editor/drafts">草稿</a></div>
        </div>
    </div>
</template>

<script>
import NavUser from '~/js/components/common/NavUser.vue';
import Uploader from '~/js/components/common/Uploader.vue';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import Alert from '~/js/components/common/Alert.vue';
import { ErrorCode } from '~/js/constants/error.js';
import { myHTTP } from '~/js/common/net.js';
import { trim } from '~/js/utils/utils.js';

export default {
    props: [
        'isRich',
        'logoBoxWidth',
        'userID',
        'avatarURL'
    ],
    data () {
        return {
            articleTitle: '',
            coverURL: '',
            isCoverUploading: false,
            coverToggled: false,
            publishToggled: false,
            markdownToggled: false,
            selectHotCategoryID: undefined,
            hotCategories: [],
            categories: [],
            isLoadingCategory: false,
            selectCategoryID: undefined,
            switchEditorAlertVisible: false,
            editorTypeLabel: '富文本',
            switchEditorAlertText: '切换编辑器后，当前内容不会迁移，但会自动保存为草稿。',
            lastQueryText: ''
        }
    },
    mounted() {
        const url = '/categories/hot';
        myHTTP.get(url).then((result) => {
            this.hotCategories = result.data.data;
        });
        setInterval(() => {
            console.log(this.selectCategoryID);
        }, 2000);
    },
    computed: {
        curSelectCategory: function() {
            console.log('selectCategory', this.selectCategoryID);
            if (!this.selectCategoryID) {
                return null;
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
        onPublish() {
            const cID = this.selectHotCategoryID || this.selectCategoryID;
            if (!cID) {
                this.$refs.errorTip.show('请至少选择一个分类');
                return;
            }
            this.$emit('on-publish', cID, this.articleTitle);
        },
        onCancelSelectCategory() {
            this.selectCategoryID = undefined;
        },
        onSelectHotCategory(id) {
            this.selectHotCategoryID = id;
            this.selectCategoryID = undefined;
            this.$nextTick(() => {
                this.selectHotCategoryID = id;
                this.$emit('on-category-change', this.selectHotCategoryID);
            });
        },
        onSelectCategoryChange() {
            console.log('onSelectCategoryChange', this.selectCategoryID);
            this.selectHotCategoryID = undefined;
            this.$emit('on-category-change', this.selectCategoryID);
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
            });
        },
        switchEditor() {
            this.$refs.switchEditorAlert.show(`切换为${this.editorTypeLabel}编辑器`, this.switchEditorAlertText);
            this.markdownToggled = false;
        },
        onSwitchEditorAlertOk() {
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
        NavUser,
        Uploader,
        ErrorTip,
        Alert,
    }
}
</script>

<style lang="scss">
.category-box .ivu-select-selection {
    border-left: none!important;
    border-right: none!important;
    border-top: none!important;
    border-color: #ddd;
}

.ivu-select-visible .ivu-select-selection {
    box-shadow: none!important;
    border-color: #ddd;
}

.ivu-select-selection-focused, .ivu-select-selection:hover {
    border-color: #ddd;
}

.ivu-select-item-selected, .ivu-select-item-selected:hover {
    color: #ea6f5a;
}

.ivu-select-single .ivu-select-input {
    padding-left: 0;
    cursor: text;
}

.tag-input {
    padding-bottom: 10px;
}
</style>
