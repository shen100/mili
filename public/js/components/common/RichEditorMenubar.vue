<template>
    <EditorMenuBar :editor="editor">
        <div class="mili-editor-menubar" slot-scope="{ commands, isActive, getMarkAttrs }">
            <button
                :class="{ 'mili-editor-menubar-active': isActive.bold() }"
                @click="commands.bold">
                <i class="mili-editor-icon-bold"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.italic() }"
                @click="commands.italic">
                <i class="mili-editor-icon-italic"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.underline() }"
                @click="commands.underline">
                <i class="mili-editor-icon-underline"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-codeblock': isActive.code_block() }"
                @click="commands.code_block">
                <i class="mili-editor-icon-codeblock"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.code() }"
                @click="commands.code">
                <i class="mili-editor-icon-code"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.heading({ level: 1 }) }"
                @click="commands.heading({ level: 1 })">
                <i class="mili-editor-icon-h1"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.heading({ level: 2 }) }"
                @click="commands.heading({ level: 2 })">
                <i class="mili-editor-icon-h2"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.bullet_list() }"
                @click="commands.bullet_list">
                <i class="mili-editor-icon-ul"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.ordered_list() }"
                @click="commands.ordered_list">
                <i class="mili-editor-icon-ol"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.blockquote() }"
                @click="commands.blockquote">
                <i class="mili-editor-icon-blockquote"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.link() }"
                @click="log( getMarkAttrs() ) && showLinkModel(getMarkAttrs('link'))">
                <i class="mili-editor-icon-link"></i>
            </button>

            <button
                @click="log(commands) && showUploadImagePrompt(commands.image)">
                <i class="mili-editor-icon-image"></i>
            </button>

            <Modal v-model="linkModelVisible" class-name="vertical-center-modal" width="460" :closable="false" footer-hide>
                <div slot="header" class="delete-modal-header">
                    <h4>创建链接</h4>
                    <button @click="hideLinkModel" type="button" class="close">×</button> 
                </div>
                <div class="delete-modal-body">
                    <input ref="linkInput" v-model="linkURL" 
                        @keyup.enter="setLinkURL"
                        @keydown.esc="hideLinkModel"
                        type="text" placeholder="请输入网址">
                </div>
                <div class="delete-modal-footer">
                    <button @click="setLinkURL(commands.link, linkURL)" class="submit">确认</button> 
                    <button @click="hideLinkModel"  class="cancel">取消</button>
                </div>
            </Modal>
        </div>
    </EditorMenuBar>
</template>

<script>
/*
 * https://tiptap.scrumpy.io
 * https://github.com/scrumpy/tiptap
 */
import { EditorMenuBar } from 'tiptap';

export default {
    props: [
        'editor'
    ],
    data () {
        return {
            linkURL: '',
            linkModelVisible: false,
        };
    },
    methods: {
        log(data) {
            console.log(data);
            return true;
        },
        showUploadImagePrompt(command) {
            const src = prompt('Enter the url of your image here')
            if (src !== null) {
                command({ src });
            }
        },
        setLinkURL(command, url) {
            url = url || null;
            command({ href: url });
            this.linkModelVisible = false;
            this.editor.focus();
        },
        showLinkModel(attrs) {
            const { view } = this.editor;
            const { selection } = view.state;
            console.log('selection.empty', selection.empty);
            if (selection.empty) {
                return;
            }
            this.linkURL = attrs.href || '';
            this.linkModelVisible = true;
            this.$nextTick(() => {
                this.$refs.linkInput.focus();
            });
        },
        hideLinkModel() {
            this.linkModelVisible = false;   
        }
    },
    components: {
        EditorMenuBar,
    },
}
</script>

<style>
    .included-modal-header {
        padding: 20px;
        border-bottom: 1px solid #e5e5e5;
    }

    .included-modal-header .close {
        margin-top: -2px;
    }

    .included-modal-title {
        margin: 0;
        line-height: 1.42857;
        font-size: 17px;
        font-weight: 700;
        color: #333;
        margin-bottom: 4px;
    }

    .included-modal-header .new-note-btn {
        padding-left: 10px;
        font-size: 13px;
        font-weight: 400;
        color: #42c02e;
        vertical-align: middle;
    }

    .included-modal-header .close {
        font-family: -apple-system,SF UI Text,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif;
        float: right;
        line-height: 1;
        color: #000;
        opacity: .2;
        filter: alpha(opacity=20);
        font-weight: 200;
        font-size: 26px;
        outline: none;
        text-shadow: none;
        padding: 0;
        cursor: pointer;
        background: transparent;
        border: 0;
        -webkit-appearance: none;
    }

    .included-modal-header .close:focus, .included-modal-header .close:hover {
        color: #000;
        text-decoration: none;
        cursor: pointer;
        opacity: .5;
        filter: alpha(opacity=50);
    }

    .included-modal-header .notice {
        font-size: 13px;
        vertical-align: middle;
        color: #969696;
    }

    .included-modal-header div {
        margin: 20px 0 0;
        position: relative;
    }

    .included-modal-header:after {
        clear: both;
    }

    .included-modal-header div .search-input {
        padding: 0 40px 0 20px;
        width: 100%;
        height: 35px;
        font-size: 14px;
        background-color: hsla(0, 0%, 71%, .2);
        border: none;
        border-radius: 40px;
    }

    .included-modal-header div .search-input::-webkit-input-placeholder {
        color: #999;
    }

    .included-modal-header div .search-btn {
        position: absolute;
        top: 0;
        right: 6px;
        width: 30px;
        height: 30px;
        color: #969696;
        text-align: center;
    }

    .included-modal-header div .ic-search {
        margin: 9px -1px 0 0;
        display: block;
    }

    .included-modal-header .ic-search {
        font-size: 17px;
    }

    .included-modal-header .ic-search:before {
        content: "\E618";
    }

    .included-modal-body {
        position: relative;
        padding: 0;
        height: 460px;
        overflow: auto;
    }

    .included-modal-body ul {
        margin: 0;
        list-style: none;
    }

    .included-modal-body li {
        display: block!important;
        position: relative;
        padding: 20px 100px 20px 25px;
        font-size: 15px;
        border-bottom: 1px solid #e6e6e6;
    }

    .included-modal-body .note-name {
        display: inherit;
        vertical-align: middle;
        max-width: 85%;
        color: #333;
    }

    .included-modal-body .action-btn {
        position: absolute;
        top: 50%;
        right: 20px;
        margin-top: -12px;
        padding: 2px 8px;
        font-size: 13px;
        border-radius: 20px;
        line-height: normal;
        color: #42c02e;
        border: 1px solid #42c02e;
    }

    .included-modal-body .push:hover {
        background-color: rgba(66, 192, 46, .05);
    }

    .included-modal-body .remove {
        color: #ea6f5a;
        border: 1px solid #ea6f5a;
    }

    .included-modal-body .remove:hover {
        background-color: rgba(236, 97, 73, .05);
    }



    .included-modal-body .has-add {
        color: #969696;
        font-size: 13px;
        vertical-align: middle;
    }

    .modal-notes-placeholder {
        padding: 25px 20px 25px 25px;
        margin-bottom: 20px;
        border-bottom: 1px solid #f0f0f0;
    }


    @keyframes shortLoading {
        0% {
            width: 20%
        }

        50% {
            width: 40%
        }

        to {
            width: 20%
        }
    }

    .modal-notes-placeholder .text {
        width: 40%;
        height: 15px;
        background-color: #eaeaea;
        -webkit-animation: shortLoading 1s ease-in-out -.5s infinite;
        animation: shortLoading 1s ease-in-out -.5s infinite;
    }

    .modal-notes-placeholder .btn {
        font-weight: 400;
        text-align: center;
        vertical-align: middle;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        background-image: none;
        border: 1px solid transparent;
        white-space: nowrap;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: default!important;
        margin: -18px 0 0!important;
        width: 44px;
        height: 24px;
        background-color: #eaeaea;
        border-radius: 20px;
        float: right;
    }

    .included-modal-body .default {
        padding-top: 200px;
        font-size: 15px;
        color: #999;
        text-align: center;
    }

    .delete-modal-header {
        padding: 20px;
        border-bottom: 1px solid #F0F0F0;
    }

    .delete-modal-header h4 {
        margin: 0;
        color: #333;
        text-align: left;
        font-size: 18px;
    }

    .delete-modal-body {
        padding: 20px 20px 20px 20px;
        font-size: 15px;
        color: #333;
        -webkit-box-flex: 1;
        -webkit-flex-grow: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .delete-modal-body input {
        margin-top: 10px;
        padding: 8px 10px;
        width: 100%;
        background-color: transparent;
        border: 1px solid #d5d5d5;
        border-radius: 3px;
    }

    .delete-modal-footer {
        padding: 20px;
        height: 80px;
        background-color: #fff;
    }

    .delete-modal-footer button {
        padding: 0;
        margin: 0;
        background-color: transparent;
        border: 0;
        float: right;
        font-size: 13px;
    }

    .delete-modal-footer .submit {
        margin-left: 30px;
        color: #ea6f5a;
        border-color: rgba(236, 97, 73, .7);
        padding: 4px 12px;
        border: 1px solid;
        border-radius: 20px;
    }

    .delete-modal-footer .submit:hover {
        border-color: #ea6f5a;
        background-color: rgba(236,97,73,.05);
    }

    .delete-modal-footer .cancel {
        margin-top: 5px;
        color: #969696;
    }

    .delete-modal-footer .cancel:hover {
        color: #333;
    }

    .delete-modal-body input::-webkit-input-placeholder {
        color: #999;
    }

    .ivu-modal-mask {
        background-color: hsla(0, 0%, 100%, .7);
    }

    .ivu-modal-header {
        padding: 0;
        border-bottom: none;
    }

    .ivu-modal-body {
        padding: 0;
    }

    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .vertical-center-modal .ivu-modal {
        top: 0;
    }

    .ivu-modal-content {
        box-shadow: 0 5px 25px rgba(0,0,0,.1);
        border: 1px solid rgba(0,0,0,.1);
    }
</style>