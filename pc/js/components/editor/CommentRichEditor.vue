<template>
    <div v-clickoutside="onClickOutside" class="comment-editor-box">
        <div @keyup.meta.enter="onEnterSubmit" @keyup.ctrl.enter="onEnterSubmit" 
            class="comment-editor-cbox"
            :class="{'comment-editor-cbox-boilingpoint': source === 'createboilingpoint', 'comment-editor-focus': isFocus}">
            <editor-content class="mili-editor-content" :editor="editor" />
            <div v-if="source === 'createboilingpoint'" @click="onFocusAreaClick" class="editor-focus-area"></div>
        </div>
        <slot name="upload-list"></slot>
        <div v-if="sendVisible" class="write-function-block" :style="{height: source === 'createboilingpoint' ? '50px' : '0'}">
            <div class="emoji-modal-wrap">
                <CommentRichEditorEmoji :source="source"
                    :uploadAllowed="uploadAllowed" 
                    @imgUploadSuccess="onImgUploadSuccess" 
                    @topicClick="onTopicClick"
                    @topicSelected="onTopicSelected"
                    :editor="editor" />
            </div>
            <template v-if="source !== 'createboilingpoint'">
                <a @click="onEnterSubmit" class="btn btn-send" :class="{disabled: contentIsEmpty}">评论</a>
                <div class="hint">Ctrl or ⌘ + Enter 发表</div>
            </template>
            <template v-if="source === 'createboilingpoint'">
                <button @click="onEnterSubmit" class="btn btn-send-boilingpoint" :class="{active: boilingpointSubmitEnable}">发布</button>
                <div class="hint-boilingpoint">Ctrl or ⌘ + Enter</div>
            </template>
        </div>
    </div>
</template>

<script>
// https://www.npmjs.com/package/tiptap
// https://github.com/scrumpy/tiptap
// https://tiptap.scrumpy.io/

import striptags from 'striptags';
import { Editor, EditorContent } from 'tiptap';
import { myHTTP } from '~/js/common/net.js';
import { trim } from '~/js/utils/utils.js';
import { ErrorCode } from '~/js/constants/error.js';
import { isContentEmpty } from '~/js/utils/dom.js';
import {
    Image,
    Placeholder,
} from 'tiptap-extensions';
import CommentRichEditorEmoji from '~/js/components/editor/CommentRichEditorEmoji.vue';

export default {
    name: 'CommentRichEditor',
    props: [
        'uploadAllowed', // 是否允许上传图片
        // article: 文章的评论;  bookchapter: 开源图书章节的评论; createboilingpoint: 创建沸点; boilingpoint: 沸点的评论
        'source',
        'collectionID', // 如果是图书章节的评论，那么collectionID就是 图书id
        'sourceID',
        'parentID',
        'rootID',
        'content',
        'emptyPlaceholder',
        'maxWords',
        'sendDefVisible', // 初始化编辑器时，是否显示发送按钮
    ],
    data () {
        return {
            sendVisible: typeof this.sendDefVisible === 'undefined' ? true : this.sendDefVisible,
            editor: new Editor({
                extensions: [
                    new Image(),
                    new Placeholder({
                        emptyClass: 'is-empty',
                        emptyNodeText: this.emptyPlaceholder,
                        showOnlyWhenEditable: true,
                    }),
                ],
                content: '',
                onFocus: this.onEditorFocus,
                onBlur: this.onEditorBlur,
                onUpdate: this.onContentUpdate
            }),
            isSaving: false,
            contentIsEmpty: true, // 输入了文本，或表情时，contentIsEmpty为false, 否则为true
            isFocus: false,
            maxWordCount: this.maxWords || 1000,
            remainingWords: this.maxWords || 1000,
        };
    },
    computed: {
        boilingpointSubmitEnable() {
            // 输入了文本，或表情，且输入的文本没有超过 maxWordCount
            return !this.contentIsEmpty && this.remainingWords >= 0;
        }
    },
    mounted() {
    },
    beforeDestroy() {
        this.editor.destroy(); 
    },
    methods: {
        onContentUpdate() {
            let content = trim(this.editor.getHTML() || '');
            const txt = trim(striptags(content)) || '';
            this.remainingWords = this.maxWordCount - txt.length;

            if (isContentEmpty(content, 'rich')) {
                this.contentIsEmpty = true;
            } else {
                this.contentIsEmpty = false;
            }
            this.$emit('update', {
                remainingWords: this.remainingWords,
                content,
            });
        },
        getHTML() {
            return this.editor.getHTML();
        },
        setHTML(html) {
            this.editor.setContent(html);
            let content = html;
            const txt = trim(striptags(content)) || '';
            this.remainingWords = this.maxWordCount - txt.length;

            if (isContentEmpty(content, 'rich')) {
                this.contentIsEmpty = true;
            } else {
                this.contentIsEmpty = false;
            }
        },
        onFocusAreaClick() {
            // fix Editor method `focus()` doesn't work
            // https://github.com/scrumpy/tiptap/issues/389
            this.$nextTick(() => {
                this.editor.view.dom.focus();
            });
        },
        focus() {
            this.isFocus = true;
            this.editor.focus();
            setTimeout(() => {
                // 下面这行代码不能去掉，onClickOutside 也会调用,
                // 将this.sendVisible 设为 false了
                this.sendVisible = true;
            }, 100);
        },
        onEditorFocus() {
            this.sendVisible = true;
            this.isFocus = true;
            this.$emit('focus');
        },
        onEditorBlur() {
            this.isFocus = false;
            this.$emit('blur');
        },
        onClickOutside() {
            // this.sendDefVisible 为 undefined 的话，初始化编辑器时 也显示发送按钮
            if (!this.sendDefVisible && typeof this.sendDefVisible !== 'undefined') {
                this.sendVisible = false;
            }
        },
        onCancelComment() {
            this.$emit('cancel');
        },
        onEnterSubmit() {
            if (this.source === 'createboilingpoint') {
                this.onBoilingpointSubmit();
            } else {
                this.onComment();
            }
        },
        onComment() {
            this.editor.blur();
            if (this.isSaving === true) {
                return;
            }
            let content = trim(this.editor.getHTML() || '');
            if (isContentEmpty(content, 'rich')) {
                this.$emit('error', '内容不能为空');
                return;
            }
            const url = `/comments/${this.source}`;
            const reqData = {
                sourceID: this.sourceID,
                htmlContent: content,
            };
            if (this.collectionID) {
                reqData.collectionID = this.collectionID;
            }
            if (this.parentID) {
                reqData.parentID = this.parentID;
            }
            if (this.rootID) {
                reqData.rootID = this.rootID;
            }
            this.isSaving = true;
            myHTTP.post(url, reqData).then((res) => {
                this.isSaving = false;
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.editor.setContent('<p></p>');
                    this.sendVisible = false;
                    const comment = res.data.data.comment;
                    this.$emit('success', comment);
                }
            }).catch((err) => {
                this.isSaving = false;
            });
        },
        onImgUploadSuccess(imgURL, imgData) {
            this.$emit('imgUploadSuccess', imgURL, imgData);
        },
        onBoilingpointSubmit() {
            if (!this.boilingpointSubmitEnable) {
                return;
            }
            this.$emit('success');
        },
        onTopicClick() {
            this.$emit('topicClick');
        },
        onTopicSelected(topic) {
            this.$emit('topicSelected', topic);
        }
    },
    components: {
        EditorContent,
        CommentRichEditorEmoji,
    },
}
</script>

<style>
.comment-editor-cbox {
    min-height: 0;
    padding: 7px 12px;
    border: 1px solid #dcdcdc;
    border-radius: 2px;
    background-color: #fff;
}

.comment-editor-cbox-boilingpoint {
    min-height: 80px;
    background-color: #f9fafb;
    border-bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.editor-focus-area {
    height: 30px;
    cursor: text;
}

.comment-editor-focus {
    border-color: #ea6f5a;
}

.comment-editor-cbox p {
    line-height: 24px!important;
    margin-top: 0!important;
    margin-bottom: 0!important;
}

/* 设置emoji图片宽高 */
.comment-editor-cbox img {
    display: inline-block;
    vertical-align: top;
    margin-top: 4px;
    width: 24px;
    height: 24px;
}

.comment-editor-box * {
    outline: none;
}

.mili-editor-content p.is-empty {
    margin: 0;
}

.mili-editor-content p.is-empty:first-child::before {
    content: attr(data-empty-text);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
    font-size: 14px;
}

.comment-editor-box .emoji-modal-wrap {
    position: relative;
}

.comment-editor-box .emoji {
    margin: 15px 0 0;
    float: left;
}

.comment-editor-box .emoji:hover {
    text-decoration: none;
}

.comment-editor-box .emoji i {
    font-size: 20px;
    color: #969696;
}

.comment-editor-box .emoji i:hover {
    color: #2f2f2f;
}

.ic-comment-emotions:before {
    content: "\E64A";
}

.comment-editor-box .hint, .comment-editor-box .hint-boilingpoint {
    float: right;
    margin: 18px 8px 0 20px;
    font-size: 13px;
    color: #969696;
}

.comment-editor-box .hint-boilingpoint {
    float: right;
    margin-right: 10px;
}

.comment-editor-box .btn-send, .comment-editor-box .btn-send-boilingpoint {
    box-sizing: border-box;
    float: right;
    width: 62px;
    height: 32px;
    line-height: 32px;
    margin: 10px 0;
    margin-bottom: 0;
    padding: 0;
    font-size: 16px;
    border: none;
    border-radius: 2px;
    color: #fff!important;
    background-color: #ea6f5a;
    cursor: pointer;
    outline: none;
    display: block;
}

.btn-send-boilingpoint.active {
    cursor: pointer!important;
    opacity: 1!important;
}

.comment-editor-box .btn-send:hover {
    background-color: #ec6149;
}

.comment-editor-box .btn-send.disabled {
    cursor: default;
    opacity: .4;
    background-color: #ea6f5a!important;
}

.comment-editor-box .btn-send-boilingpoint {
    opacity: .2;
    cursor: not-allowed;
    padding: 0;
    width: 72px;
    height: 32px;
    border-radius: 2px;
    background-color: #ea6f5a;
    margin-top: 12px;
}

.comment-editor-box .cancel {
    float: right;
    margin: 18px 30px 0 0;
    font-size: 16px;
    color: #969696;
}

.comment-editor-box .cancel:hover {
    text-decoration: none;
    color: #2f2f2f;
}
</style>
