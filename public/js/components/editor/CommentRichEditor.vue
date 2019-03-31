<template>
    <div class="comment-editor-box">
        <div class="comment-editor-cbox">
            <editor-content class="mili-editor-content" :editor="editor" />
        </div>
        <div class="write-function-block">
            <div class="emoji-modal-wrap">
                <CommentRichEditorEmoji :editor="editor" />
            </div>
            <div class="hint">⌘+Return 发表</div>
            <a class="btn btn-send">发送</a>
            <a class="cancel">取消</a>
        </div>
    </div>
</template>

<script>
// https://www.npmjs.com/package/tiptap
// https://github.com/scrumpy/tiptap
// https://tiptap.scrumpy.io/

import { Editor, EditorContent } from 'tiptap';
import {
    Image,
    Placeholder,
} from 'tiptap-extensions';
import MyHardBreak from '~/js/components/editor/MyHardBreak.js';
import CommentRichEditorEmoji from '~/js/components/editor/CommentRichEditorEmoji.vue';

export default {
    name: 'CommentRichEditor',
    props: [
        'content',
    ],
    data () {
        return {
            editor: new Editor({
                extensions: [
                    new MyHardBreak(),
                    new Image(),
                    new Placeholder({
                        emptyClass: 'is-empty',
                        emptyNodeText: '写下你的评论',
                        showOnlyWhenEditable: true,
                    }),
                ],
                content: ''
            })
        };
    },
    beforeDestroy() {
        this.editor.destroy();
    },
    methods: {
        getHTML() {
            return this.editor.getHTML();
        }
    },
    mounted() {
        this.$nextTick(() => {
        })
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

.comment-editor-box .hint {
    float: left;
    margin: 20px 0 0 20px;
    font-size: 13px;
    color: #969696;
}

.comment-editor-box .btn-send {
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

