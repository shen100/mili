<template>
    <div class="md-editor-body-box" :style="{'display': inited ? 'block' : 'none'}">
        <ErrorTip ref="errorTip" />
        <div class="md-editor-body" :class="{'md-editor-expand': !isSideBySide}">
            <div class="mili-editor">
                <textarea style="border: none;" ref="textarea"></textarea>
            </div>
        </div>
        <div class="md-editor-footer">
            <div class="md-editor-footer-left" :style="{width: isSideBySide ? '50%' : '100%'}">
                <div class="md-editor-markdown-btn">
                    <img src="../../../../images/editor/markdown.svg">
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
                    <div class="md-editor-uploadimg-btn"><img src="../../../../images/editor/uploadimg.svg"></div>
                </Uploader>
                <div v-if="isSideBySide" class="md-editor-togglelayout-btn" @click="onToggleSideBySide">
                    <img src="../../../../images/editor/togglelayout.svg" />
                </div>
                <div v-else class="md-editor-togglelayout-btn" @click="onToggleSideBySide">
                    <img src="../../../../images/editor/togglelayout2.svg" />
                </div>
            </div>
            <div v-if="isSideBySide" class="md-editor-footer-right">
                <div class="md-editor-footer-preview">预览</div>
                <div class="md-editor-footer-wordcount">{{wordCount}}字</div>
            </div>
        </div>
    </div>
</template>

<script>
// https://github.com/sparksuite/simplemde-markdown-editor

import marked from 'marked';
import striptags from 'striptags';
import Uploader from '~/js/components/common/Uploader.vue';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import { trim } from '~/js/utils/utils.js';

export default {
    props: [
        'content',
    ],
    data () {
        const os = 'mac';
        const shortcut = {
            mac: {
                h1: 'Ctrl / ⌘ + Shift + K',
                h2: 'Ctrl / ⌘ + Shift + K',
                b: 'Ctrl / ⌘ + Shift + K',
                a: 'Ctrl / ⌘ + Shift + K',
                code: 'Ctrl / ⌘ + Shift + K',
                blockcode: 'Ctrl / ⌘ + Shift + K',
                img: 'Ctrl / ⌘ + Shift + K',
                ul: 'Ctrl / ⌘ + Shift + K' 
            },
            win: {

            },
            linux: {

            }
        };
        return {
            SimpleMDE: null,
            simplemde: null,
            inited: false,
            isSideBySide: true,     
            wordCount: 0,
            shotcutArr: [
                [ '# 标题', 'H1', shortcut[os].h1 ],
                [ '## 标题', 'H2', shortcut[os].h2 ],
                [ '**文本**', '<b>粗体</b>', shortcut[os].b ],
                [ '[描述](http://)', '<a href="javascript:void(0);">链接</a>', shortcut[os].a ],
                [ '`code`', '<code>Inline Code</pre>', shortcut[os].blockcode ],
                [ '```code```', '<code>Code</pre>', shortcut[os].code ],
                [ '![alt](http://)', '图片', shortcut[os].img ],
                [ '* item', '列表', shortcut[os].ul ],
            ],
            initialContent: this.content || '',
            mdContent: '',
        }
    },
    methods: {
        initSimplemde() {
            const SimpleMDE = window.SimpleMDE;
            this.SimpleMDE = SimpleMDE;
            let simplemde = new SimpleMDE({
                element: this.$refs.textarea,
                autoDownloadFontAwesome: false,
                autosave: {
                    enabled: false
                },
                // If set to false, indent using spaces instead of tabs. Defaults to true.
                indentWithTabs: false,
                // 在这设初始文本有样式问题，改为实例化后
                // 通过value方法传simplemde.value(this.mdContent);
                initialValue: '',
                // Custom placeholder that should be displayed
                placeholder: '输入正文...',
                promptURLs: false,
                codeSyntaxHighlighting: true,
                spellChecker: false,
                status: false,
                toolbar: false,
                previewRender: this.previewRender.bind(this)
            });
            this.simplemde = simplemde;
            const pt = SimpleMDE.prototype;
            if (!pt.getImageURL) {
                pt.getImageURL = function () {
                    return this.theImageURL || '';
                }
                pt.setImageURL = function (url) {
                    this.theImageURL = url;
                }
            }
            this.simplemde.toggleSideBySide();
            // 初始时，编辑区会抖动一下，延时100ms显示编辑器，避免抖动
            setTimeout(() => {
                this.inited = true;
                this.$nextTick(() => {
                    this.simplemde.value(this.initialContent);
                    this.mdContent = this.initialContent;
                });
            }, 100);
        },
        onImgUploadSuccess(imgURL) {
            this.simplemde.setImageURL(imgURL);
            this.SimpleMDE.drawImage(this.simplemde);
        },
        onImgUploadFail(message) {
            this.$refs.errorTip.show(message);
        },
        previewRender(plainText, preview) {
            // this.simplemde.codemirror.on('change', function () {
            //     self.$emit('change', self.simplemde.value())
            // });
            this.mdContent = plainText;
            const html = marked(plainText || '');
            const txt = trim(striptags(html));
            this.wordCount = txt.length || 0;
            return html;
        },
        onToggleSideBySide() {
            this.isSideBySide = !this.isSideBySide;
            this.$nextTick(() => {
                this.simplemde.toggleSideBySide();
                this.$emit('togglesidebyside', this.isSideBySide);
            });
        },
        getContent() {
            return this.mdContent;
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initSimplemde();
        });
    },
    components: {
        Uploader,
        ErrorTip,
    }
}
</script>

