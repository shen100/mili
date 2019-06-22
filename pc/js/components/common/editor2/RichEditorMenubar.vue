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
                :class="{ 'mili-editor-menubar-active': isActive.blockquote() }"
                @click="commands.blockquote">
                <i class="mili-editor-icon-blockquote"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.code_block() }"
                @click="onCodeBlockClick(isActive, commands)">
                <i class="mili-editor-icon-codeblock"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.code() }"
                @click="commands.code">
                <i class="mili-editor-icon-code"></i>
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
                :class="{ 'mili-editor-menubar-active': isActive.link() }"
                @click="showLinkModel(getMarkAttrs('link'))">
                <i class="mili-editor-icon-link"></i>
            </button>

            <Uploader ref="uploader" @success="onImgUploadSuccess(commands)" @error="onImgUploadFail">
                <button>
                    <i class="mili-editor-icon-image"></i>
                </button>
            </Uploader>

            <Modal v-model="linkModelVisible" class-name="vertical-center-modal" width="420" :closable="false" footer-hide>
                <div slot="header" class="link-modal-header">
                    <button @click="hideLinkModel" type="button" class="close">×</button> 
                    <h4>创建链接</h4>
                </div>
                <div class="link-modal-body">
                    <img src="/images/index/share-icon.svg">
                    <input ref="linkInput" v-model="linkURL" 
                        @keyup.enter="setLinkURL"
                        @keydown.esc="hideLinkModel"
                        type="text" placeholder="输入网址...">
                </div>
                <div class="link-modal-footer">
                    <button @click="setLinkURL(commands.link, linkURL)" class="submit">确认</button> 
                    <button @click="hideLinkModel" class="cancel">取消</button>
                </div>
            </Modal>

            <ErrorTip ref="errorTip" />
        </div>
    </EditorMenuBar>
</template>

<script>
/*
 * https://tiptap.scrumpy.io
 * https://github.com/scrumpy/tiptap
 */
import { EditorMenuBar } from 'tiptap';
import validator from 'validator';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import Uploader from '~/js/components/common/Uploader.vue';
import { trim } from '~/js/utils/utils.js';

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
        showUploadImagePrompt(command) {
            const src = prompt('Enter the url of your image here')
            if (src !== null) {
                command({ src });
            }
        },
        setLinkURL(command, url) {
            url = trim(url || '');
            if (url && validator.isURL(url, {require_protocol: true})) {
                command({ href: url });
            } else if (!url) {
                command({ href: null });
            } else {
                this.$refs.errorTip.show('不是有效的url');    
            }
            this.linkModelVisible = false;
            this.editor.focus();
        },
        showLinkModel(attrs) {
            const { view } = this.editor;
            const { selection } = view.state;
            // 当前选中了内容时，才弹出添加链接的弹框
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
            this.editor.focus();
        },
        onImgUploadSuccess(commands) {
            const imgURL = this.$refs.uploader.getImageURL();
            if (imgURL) {
                commands.image({ src: imgURL });
                commands.my_hard_break();
            }
            this.editor.focus();
        },
        onImgUploadFail(message) {
            this.$refs.errorTip.show(message);
        },
        onCodeBlockClick(isActive, commands) {
            if (!isActive.code_block()) {
                commands.my_hard_break({ isCodeBlock: true });
            }
            commands.code_block();
        }
    },
    components: {
        EditorMenuBar,
        ErrorTip,
        Uploader,
    },
}
</script>

<style>
    .link-modal-header {
        padding: 30px;
    }

    .link-modal-header h4 {
        margin: 0;
        color: #333;
        text-align: left;
        font-size: 18px;
    }

    .link-modal-header .close {
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
        margin-top: -4px;
    }

    .link-modal-body {
        padding: 0 30px;
        font-size: 15px;
        color: #333;
        display: flex;
    }

    .link-modal-body img {
        margin-right: 10px;
    }

    .link-modal-body input {
        height: 22px;
        line-height: 22px;
        padding: 0;
        width: 100%;
        border: none;
    }

    .link-modal-footer {
        padding: 20px;
        height: 80px;
        background-color: #fff;
    }

    .link-modal-footer button {
        padding: 0;
        margin: 0;
        background-color: transparent;
        border: 0;
        float: right;
        font-size: 13px;
    }

    .link-modal-footer .submit {
        margin-left: 30px;
        color: #ea6f5a;
        border-color: rgba(236, 97, 73, 0.7);
        padding: 5px 22px;
        border: 1px solid;
        border-radius: 3px;
        height: 32px;
        line-height: 20px;
        box-sizing: border-box;
    }

    .link-modal-footer .submit:hover {
        border-color: #ea6f5a;
        background-color: rgba(236, 97, 73, .05);
    }

    .link-modal-footer .cancel {
        color: #969696;
        height: 32px;
        line-height: 32px;
    }

    .link-modal-footer .cancel:hover {
        color: #333;
    }

    .link-modal-body input::-webkit-input-placeholder {
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
        box-shadow: 0 5px 25px rgba(0, 0, 0, .1);
        border: 1px solid rgba(0, 0, 0, .1);
        border-radius: 3px;
    }
</style>