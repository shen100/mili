<template>
    <div v-clickoutside="onClickOutside" class="comment-editor-box">
        <div @keydown.meta.enter="onComment" @keydown.ctrl.enter="onComment" 
            class="comment-editor-cbox" :class="{'comment-editor-cbox-boilingpoint': editorType === 'boilingpoint'}">
            <editor-content class="mili-editor-content" :editor="editor" />
        </div>
        <slot name="upload-list"></slot>
        <div v-if="sendVisible" class="write-function-block">
            <div class="emoji-modal-wrap">
                <CommentRichEditorEmoji :uploadAllowed="uploadAllowed" @imgUploadSuccess="onImgUploadSuccess" :editor="editor" />
            </div>
            <template v-if="editorType === 'comment'">
                <div class="hint">Ctrl or ⌘ + Enter 发表</div>
                <a @click="onComment" class="btn btn-send">发送</a>
                <a @click="onCancelComment" class="cancel">取消</a>
            </template>
            <template>
                <button class="btn btn-send-boilingpoint">发布</button>
                <div v-if="editorType === 'boilingpoint'" class="hint-boilingpoint">Ctrl or ⌘ + Enter</div>
            </template>
        </div>
    </div>
</template>

<script>
// https://www.npmjs.com/package/tiptap
// https://github.com/scrumpy/tiptap
// https://tiptap.scrumpy.io/

import { Editor, EditorContent } from 'tiptap';
import { myHTTP } from '~/js/common/net.js';
import { trim } from '~/js/utils/utils.js';
import { ErrorCode } from '~/js/constants/error.js';
import { isContentEmpty } from '~/js/utils/dom.js';
import {
    Image,
    Placeholder,
} from 'tiptap-extensions';
import MyHardBreak from '~/js/components/editor/MyHardBreak.js';
import CommentRichEditorEmoji from '~/js/components/editor/CommentRichEditorEmoji.vue';

export default {
    name: 'CommentRichEditor',
    props: [
        'uploadAllowed', // 是否允许上传图片
        'editorType', // comment, boilingpoint
        'commentType',
        'articleID',
        'parentID',
        'rootID',
        'sendDefVisible', // 初始化编辑器时，是否默认显示发送按钮
        'content',
        'emptyPlaceholder',
    ],
    data () {
        return {
            editor: new Editor({
                extensions: [
                    new MyHardBreak(),
                    new Image(),
                    new Placeholder({
                        emptyClass: 'is-empty',
                        emptyNodeText: this.emptyPlaceholder,
                        showOnlyWhenEditable: true,
                    }),
                ],
                content: '',
                onFocus: this.onEditorFocus,
            }),
            sendVisible: this.sendDefVisible,
            isSaving: false,
        };
    },
    beforeDestroy() {
        this.editor.destroy(); 
    },
    methods: {
        getHTML() {
            return this.editor.getHTML();
        },
        focus() {
            this.editor.focus();
            setTimeout(() => {
                // 下面这行代码不能去掉，onClickOutside 也会调用,
                // 将this.sendVisible 设为 false了
                this.sendVisible = true;
            }, 100);
        },
        onEditorFocus() {
            this.sendVisible = true;
        },
        onClickOutside() {
            if (!this.sendDefVisible) {
                this.sendVisible = false;
            }
        },
        onCancelComment() {
            if (!this.sendDefVisible) {
                this.sendVisible = false;
            }
            this.$emit('cancel');
        },
        onComment() {
            this.editor.blur();
            if (this.isSaving === true) {
                return;
            }
            let content = trim(this.editor.getHTML() || '');
            if (isContentEmpty(content, true)) {
                this.$emit('error', '回复内容不能为空');
                return;
            }
            const url = `/comments?commentType=${this.commentType}`;
            const reqData = {
                articleID: this.articleID,
                content: content,
            };
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
        onImgUploadSuccess(imgURL) {
            this.$emit('imgUploadSuccess', imgURL);
        }
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    components: {
        EditorContent,
        CommentRichEditorEmoji,
    },
}
</script>

<style>
.comment-editor-box {
    margin-top: 20px;
}

.comment-editor-cbox {
    min-height: 80px;
    padding: 10px 15px;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
    background-color: hsla(0, 0%, 71%, .1);
}

.comment-editor-cbox-boilingpoint {
    background-color: #f9fafb;
    border-bottom: 0;
    border-radius: 2px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.comment-editor-cbox p {
    line-height: 32px!important;
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

.comment-editor-box .write-function-block {
    height: 50px;
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
    float: left;
    margin: 20px 0 0 20px;
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
    width: 78px;
    margin: 10px 0;
    padding: 8px 18px;
    font-size: 16px;
    border: none;
    border-radius: 20px;
    color: #fff!important;
    background-color: #42c02e;
    cursor: pointer;
    outline: none;
    display: block;
}

.comment-editor-box .btn-send:hover {
    background-color: #3db922;
}

.comment-editor-box .btn-send-boilingpoint {
    opacity: .2;
    cursor: not-allowed;
    padding: 0;
    width: 72px;
    height: 32px;
    border-radius: 2px;
    background-color: #027fff;
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

