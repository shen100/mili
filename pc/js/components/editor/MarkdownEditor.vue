<template>
    <div class="md-editor-body-box" :class="{'md-editor-no-padding-top': noPaddingTop}">
        <ErrorTip ref="errorTip" />
        <div class="md-editor-footer">
            <div class="md-editor-footer-left" style="width: 50%;">
                <div class="md-editor-markdown-btn">
                    <img src="../../../images/editor/markdown.svg">
                    <div class="md-editor-shotcut-panel">
                        <span class="md-editor-panel-title">快捷键</span>
                        <a href="https://www.appinn.com/markdown/" target="_blank" class="md-editor-more-link">更多语法</a>
                        <div class="md-editor-shotcut-table">
                            <div class="md-editor-shotcut-row">
                                <div class="md-editor-shotcut-col0" style="font-weight: 700;">Markdown</div>
                                <div class="md-editor-shotcut-col1" style="font-weight: 700;">结果</div>
                                <div class="md-editor-shotcut-col2" style="font-weight: 700;">快捷键</div>
                            </div>
                            <div :key="i" v-for="(shotcutData, i) in shotcutArr" class="md-editor-shotcut-row">
                                <div :key="j" v-for="(item, j) in shotcutData" :class="'md-editor-shotcut-col' + j"  v-html="item"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <Uploader @success="onImgUploadSuccess" @error="onImgUploadFail">
                    <div class="md-editor-uploadimg-btn"><img src="../../../images/editor/uploadimg.svg"></div>
                </Uploader>
                <!-- <div class="md-editor-togglelayout-btn">
                    <img src="../../../images/editor/togglelayout.svg" />
                </div> -->
            </div>
            <div class="md-editor-footer-splitter"></div>
            <div class="md-editor-footer-right">
                <div class="md-editor-footer-preview">预览</div>
                <div class="md-editor-footer-wordcount">{{wordCount}}字</div>
            </div>
        </div>
        <div class="md-editor-body">
            <div class="mili-editor">
                <iframe ref="editorFrame" src="/editor/markdown"></iframe>
            </div>
        </div>
    </div>
</template>

<script>
// https://nhn.github.io/tui.editor/latest/

import marked from 'marked';
import striptags from 'striptags';
import Uploader from '~/js/components/common/Uploader.vue';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import { trim } from '~/js/utils/utils.js';

export default {
    props: [
        'noPaddingTop'
    ],
    data () {
        return {
            isReady: false,
            wordCount: 0,
            mdContent: '',
            messageCallbackProxy: null,
            shotcutArr: [
                [ '# 标题', 'H1', 'Ctrl / ⌘ + H' ],
                [ '## 标题', 'H2', 'Ctrl / ⌘ + H' ],
                [ '**文本**', '<b>粗体</b>', 'Ctrl / ⌘ + B' ],
                [ '[描述](http://)', '<a href="javascript:void(0);">链接</a>', 'Ctrl / ⌘ + K' ],
                [ '`code`', '<code>Inline Code</pre>', "Ctrl / ⌘ + '" ],
                [ '```code```', '<code>Code</pre>', 'Ctrl / ⌘ + Alt-C' ],
                [ '![alt](http://)', '图片', 'Ctrl / ⌘ + Alt-I' ],
                [ '* item', '列表', 'Ctrl / ⌘ + L' ],
            ],
        }
    },
    methods: {
        onImgUploadSuccess(imgURL) {
            this.postMessage('addImage', { imgURL });
        },
        onImgUploadFail(message) {
            this.$refs.errorTip.show(message);
        },
        getContent() {
            return this.mdContent;
        },
        setContent(content) {
            console.log('setContent', content);
            this.mdContent = content;
            this.setWordCount(this.mdContent);
            this.postMessage('setContent', { content });
        },
        setWordCount(content) {
            const html = marked(content || '');
            const txt = trim(striptags(html));
            this.wordCount = txt.length || 0;
        },
        postMessage(action, data) {
            if (!this.isReady) {
                return;
            }
            this.$refs.editorFrame.contentWindow.postMessage({
                action,
                data,
            }, '*');
        },
        messageCallback(event) {
            if (!(event.data && event.data.action)) {
                return;
            }
            console.log('[MarkdownEditor]', JSON.stringify(event.data), new Date().getTime());
            switch (event.data.action) {
                case 'contentUpdated': {
                    this.mdContent = event.data.data.content;
                    this.setWordCount(this.mdContent);
                    break;
                }
                case 'ready': {
                    this.isReady = true;
                    this.postMessage('setContent', { content: this.mdContent });
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.messageCallbackProxy = this.messageCallback.bind(this);
            window.addEventListener('message', this.messageCallbackProxy);
        });
    },
    beforeDestroy() {
        window.removeEventListener('message', this.messageCallbackProxy);
    },
    components: {
        Uploader,
        ErrorTip,
    }
}
</script>

<style lang="scss" scoped>
iframe {
    width: 100%;
    height: 100%;
}

.mili-editor {
    overflow: hidden;
}

.md-editor-footer-splitter {
    border-left: 1px solid #ddd;
}
</style>