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
                        <div class="sub-title">分类</div>
                        <div class="category-list">
                            <div :key="i" v-for="(c, i) in hotCategories" :class="{active: selectCategoryIndex === i}" class="item">{{c.name}}</div>
                        </div>
                    </div>
                    <div class="category-box">
                        <div class="sub-title">标签</div>
                        <div class="user-category-list"></div>
                        <div class="tag-input tag-input">
                            <Select v-model="selectCategoryID" placeholder="添加1个标签"
                                filterable remote :remote-method="requestCategories" :loading="isLoadingCategory">
                                <Option v-for="(c, i) in categories" :value="c.id" :key="i">{{c.name}}</Option>
                            </Select>

                        </div>
                    </div>
                    <button class="publish-btn">确定并发布</button>
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
            selectCategoryIndex: 0,
            hotCategories: [
                {
                    id: 1,
                    name: 'Android'
                },
                {
                    id: 2,
                    name: '前端'
                },
                {
                    id: 3,
                    name: 'iOS'
                },
                {
                    id: 4,
                    name: '产品'
                },
                {
                    id: 5,
                    name: '设计'
                },
                {
                    id: 6,
                    name: '工具资源'
                },
                {
                    id: 7,
                    name: '阅读'
                },
                {
                    id: 8,
                    name: '后端'
                },
                {
                    id: 9,
                    name: '人工智能'
                },
                {
                    id: 10,
                    name: '运维'
                }
            ],
            categories: [
                {
                    id: 1,
                    name: 'test'
                }
            ],
            isLoadingCategory: false,
            selectCategoryID: undefined,
            switchEditorAlertVisible: false,
            editorTypeLabel: '富文本',
            switchEditorAlertText: '切换编辑器后，当前内容不会迁移，但会自动保存为草稿。',
        }
    },
    methods: {
        onPublish() {
            
        },
        requestCategories(queryText) {
            this.categories = [];
            if (!queryText) {
                this.categories = [];
                return;
            }
            this.isLoadingCategory = true;
            const url = `/categories/search?name=${encodeURIComponent(queryText)}`;
            // myHTTP.get(url).then((result) => {
            //     this.categories = result.data.data;
            //     this.isLoadingCategory = false;
            //     console.log('-------------------');
            //     console.log(this);
            //     console.log(this.categories);
            // });

            console.log(this.categories);
            setTimeout(() => {
                this.isLoadingCategory = false;
                console.log('-------------------123');
                console.log(this);
                this.categories = [
                    {
                        id: 1,
                        name: 'test'
                    }
                ];
            }, 20000);
        },
        switchEditor() {
            this.$refs.switchEditorAlert.show(`切换为${this.editorTypeLabel}编辑器`, this.switchEditorAlertText);
            this.markdownToggled = false;
        },
        onSwitchEditorAlertOk() {
            console.log('onSwitchEditorAlertOk');
        },
        onSwitchEditorAlertCancel() {
            console.log('onSwitchEditorAlertCancel');
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