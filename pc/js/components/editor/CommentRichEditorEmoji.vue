<template>
    <EditorMenuBar :editor="editor">
        <div v-clickoutside="onClickOutside" class="helloman" slot-scope="{ commands, }">
            <template>
                <a @click="switchEmojiVisible" class="boilingpoint">
                    <i class="iconfont ic-comment-emotions"></i>
                    <div class="label">表情</div>
                </a>
                <!-- 创建沸点时，才有上传图片的icon -->
                <a v-if="source === 'createboilingpoint'" class="up-img" :class="{'not-allowed': !uploadAllowed}">
                    <Uploader v-if="uploadAllowed" @uploading="onImgUploading" @success="onImgUploadSuccess" 
                        @error="onImgUploadFail">
                        <template>
                            <i class="iconfont ic-picture"></i>       
                            <div class="label">图片</div>  
                        </template>   
                    </Uploader>
                    <template v-else>
                        <i class="iconfont ic-picture not-allowed"></i>
                        <div class="label">图片</div>  
                    </template>
                </a>
                <!-- 创建沸点时，可以选择话题 -->
                <a v-if="source === 'createboilingpoint'" @click="onTopicClick" v-clickoutside="onCloseTopicPopup"
                    class="topic" style="margin-left: 20px;">
                    <div class="label">#</div>
                    <div class="label" style="position: relative;">话题<BoilingPointTopicPopup @topicSelected="onTopicSelected" @close="onCloseTopicPopup" v-if="topicPopupVisible" /></div>
                </a>
            </template>
            <div v-if="emojiVisible" class="emoji-modal arrow-top">
                <ul id="emojiTab" class="emoji-nav-tabs modal-header">
                    <li @click="changeTab(index)" :class="{active: index === tabIndex}" 
                        :key="index" v-for="index in tabs"><a></a></li>
                </ul>
                <CommentRichEditorEmojiIcons :imgPath="imgPath" :tabIndex="tabIndex" 
                    @emojionSelect="(imgURL) => onSelectEmoji(imgURL, commands)" />
            </div>
        </div>
    </EditorMenuBar>
</template>

<script>
import { EditorMenuBar } from 'tiptap';
import Uploader from '~/js/components/common/Uploader.vue';
import BoilingPointTopicPopup from '~/js/components/boilingpoint/BoilingPointTopicPopup.vue';
import CommentRichEditorEmojiIcons from '~/js/components/editor/CommentRichEditorEmojiIcons.vue';

export default {
    props: [
        // article: 文章的评论;  bookchapter: 开源图书章节的评论; createboilingpoint: 创建沸点; boilingpoint: 沸点的评论
        'source',
        'editor',
        'uploadAllowed'
    ],
    data () {
        return {
            imgPath: globalConfig.imgPath,
            tabIndex: 0,
            tabs: [0, 1, 2, 3],
            emojiVisible: false,
            topicPopupVisible: false, // 是否显示沸点的话题搜索框
        };
    },
    methods: {
        changeTab(index) {
            this.tabIndex = index;
        },
        onClickOutside() {
            this.emojiVisible = false;
        },
        switchEmojiVisible() {
            this.emojiVisible = !this.emojiVisible;
        },
        onSelectEmoji(imgURL, commands) {
            commands.image({ src: imgURL });
        },
        onImgUploading() {
        },
        onImgUploadSuccess(imgURL, imgData) {
            this.$emit('imgUploadSuccess', imgURL, imgData);
        },
        onImgUploadFail(message) {
            this.$refs.errorTip.show(message);
        },
        onTopicClick() {
            this.topicPopupVisible = !this.topicPopupVisible;
        },
        onCloseTopicPopup() {
            this.topicPopupVisible = false;
        },
        onTopicSelected(topic) {
            this.$emit('topicSelected', topic);
        }
    },
    components: {
        EditorMenuBar,
        Uploader,
        BoilingPointTopicPopup,
        CommentRichEditorEmojiIcons,
    },
}
</script>

<style>
.comment-editor-box .emoji-modal-wrap .emoji-modal {
    position: absolute;
    top: 50px;
    left: 0;
    width: 360px;
    border: 1px solid #d9d9d9;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
    z-index: 1050;
    left: -48px;
}

.comment-editor-box .emoji-modal-wrap .emoji-modal.arrow-top::before {
    border-bottom-color: #d9d9d9;
    left: 48px;
    top: -10px;
}

.arrow-top:after, .arrow-top:before {
    position: absolute;
    top: -10px;
    left: 45%;
    content: "";
    display: inline-block;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 9px solid transparent;
}

.comment-editor-box .emoji-modal-wrap .emoji-modal.arrow-top::after {
    border-bottom-color: #EEEEEE;
}

.comment-editor-box .arrow-top:after {
    left: 48px;
    top: -9px;
    border-bottom: 9px solid #fff;
}

.comment-editor-box .emoji-modal-wrap .modal-header {
    padding: 20px 0 10px;
    margin: 0;
    background: #EEEEEE;
    text-align: center;
    border-bottom: 1px solid #e5e5e5;
}

.comment-editor-box .emoji-modal-wrap .modal-header li {
    display: inline;
    margin: 0 5px;
    padding: 0;
    border: none;
    line-height: 20px;
}

.comment-editor-box .emoji-modal-wrap .modal-header a {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #999999;
    text-indent: -9999px;
    border-radius: 100%;
    color: #3194d0;
}

.comment-editor-box .emoji-modal-wrap .modal-header li.active a, .comment-editor-box .emoji-modal-wrap .modal-header a:hover {
    background: #2F2F2F;
}

.comment-editor-box .tab-content>.tab-pane {
    display: none;
}

.comment-editor-box .tab-content>.active {
    display: block;
}

.comment-editor-box .emoji-modal-wrap .tab-content ul {
    padding: 8px;
    margin: 0;
    list-style: none;
    user-select: none;
}

.comment-editor-box .emoji-modal-wrap .tab-content ul li {
    display: inline-block;
    padding: 5px !important;
    border-radius: 3px;
}

.comment-editor-box .emoji-modal-wrap .tab-content img {
    width: 24px;
    height: 24px;
    vertical-align: middle;
    border: 0;
    user-select: none;
}

.comment-editor-box .boilingpoint {
    margin: 15px 0 0;
    float: left;
    margin-top: 18px;
    line-height: 22px;
}

.comment-editor-box .boilingpoint:hover {
    text-decoration: none;
}

.comment-editor-box .boilingpoint i {
    font-size: 14px;
    color: #ea6f5a;
    display: inline-block;
    vertical-align: top;
}

.comment-editor-box .up-img {
    margin: 15px 0 0;
    float: left;
    margin-top: 18px;
    margin-left: 20px;
    line-height: 22px;
}

.comment-editor-box .up-img:hover {
    text-decoration: none;
}

.comment-editor-box .label {
    font-size: 13px;
    margin: 0 0 0 4px;
    color: #ea6f5a;
    display: inline-block;
    vertical-align: top;
    line-height: 22px;
}

.comment-editor-box .up-img i {
    font-size: 16px;
    color: #ea6f5a;
    display: inline-block;
    vertical-align: top;
}

.comment-editor-box .up-img .ic-picture:before {
    content: "\E6B2";
}

.comment-editor-box .topic {
    margin-top: 18px;
    float: left;
}

.comment-editor-box .topic:hover {
    text-decoration: none;
}

.comment-editor-box .not-allowed, .comment-editor-box .not-allowed .label {
    color: #aeb6c0!important;
    cursor: not-allowed;
}
</style>
