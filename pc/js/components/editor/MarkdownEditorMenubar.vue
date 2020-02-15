<template>
    <div>
    </div>
</template>

<script>
// 自定义tui.editor的toolbar
import Vue from 'vue';
import $ from 'jquery';
import marked from 'marked';
import striptags from 'striptags';
import { trim } from '~/js/utils/utils.js';
import { MarkedConstants } from '~/js/constants/article.js';
import UploaderPure from '~/js/components/common/UploaderPure.vue';

window.$ = $;

marked.setOptions(MarkedConstants.options);

// toolbar 上的按钮，鼠标滑过出现的tip 给个延时
let timeoutId = 0;

const tipMap = {
    bold: '粗体',
    italic: '斜体',
    h1: '标题一',
    h2: '标题二',
    blockquote: '引语',
    codeblock: '代码块',
    code: '行内代码',
    ol: '有序列表',
    ul: '无序列表',
    link: '链接',
    image: '插入图片'
};

function onShowToolTip(event) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        const $target = $(event.target);
        const targetX = $target.offset().left;
        const $i = $target.find('i');
        if ($i && $i.length) {
            const className = trim($i[0].className);
            const arr = className.split('-');
            $('.mili-md-editor-tooltip-text').text(tipMap[arr[arr.length - 1]]);
        } else if ($target[0].dataset && $target[0].dataset.tip) {
            // 上传图片
            $('.mili-md-editor-tooltip-text').text(tipMap[$target[0].dataset.tip]);
        } else {
            // 链接
            $('.mili-md-editor-tooltip-text').text(tipMap['link']);
        }
        const $tooltip = $('.mili-md-editor-tooltip');
        $tooltip.css({
            left: targetX - ($tooltip.width() - 36) / 2 + 'px',
            top: '46px',
            opacity: 1
        });
        $tooltip.show();
    }, 300);
}

function onHideToolTip(event) {
    clearTimeout(timeoutId);
    const $tooltip = $('.mili-md-editor-tooltip')
    $tooltip.css({ opacity: 0.6, top: '36px', });
    $tooltip.hide();
}

export default {
    props: ['editor', 'postMessage'],
    data() {
        return {
            wordCountTimeoutId: 0,
            heading2EventHanlderProxy: null,
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.initToolbar();
        });
    },
    beforeDestroy() {
        clearTimeout(timeoutId);
        clearTimeout(this.wordCountTimeoutId);
        $('.tui-custom-button').unbind('mouseenter', onShowToolTip);
        $('.tui-custom-button').unbind('mouseleave', onHideToolTip);
        $('.tui-toolbar-icons').unbind('mouseenter', onShowToolTip);
        $('.tui-toolbar-icons').unbind('mouseleave', onHideToolTip);
        $('#customToolbarImgUploaderBox').unbind('click');
        this.editor.eventManager.removeEventHandler('CustomHeading2', this.heading2EventHanlderProxy);
    },
    methods: {
        heading2EventHanlder() {
            this.editor.exec('Heading', 2);
        },
        initToolbar() {
            const editor = this.editor;
            editor.eventManager.addEventType('CustomHeading2');
            this.heading2EventHanlderProxy = this.heading2EventHanlder.bind(this);
            editor.eventManager.listen('CustomHeading2', this.heading2EventHanlderProxy);
            const items = [
                { name: 'bold', command: 'Bold', index: 1 },
                { name: 'italic', command: 'Italic', index: 1 },
                { name: 'h1', command: 'Heading', index: 1 },
                { name: 'h2', event: 'CustomHeading2', index: 1 },
                { name: 'blockquote', command: 'Blockquote', index: 1 },
                { name: 'codeblock', command: 'CodeBlock', index: 1 },
                { name: 'code', command: 'Code', index: 1 },
                { name: 'ul', command: 'UL', index: 1 },
                { name: 'ol', command: 'OL', index: 1 },
            ];
            items.forEach(item => this.addToolbarItem(editor, item));

            const toolbarContainer = $('.tui-toolbar-icons').parent();

            toolbarContainer.append([
                '<div id="customToolbarImgUploaderBox" data-tip="image" class="tui-custom-button">',
                '    <div id="customToolbarImgUploader"></div>',
                '</div>'
            ].join(''));

            toolbarContainer.append([
                '<div class="tui-custom-button-right-box">',
                '    <div class="tui-custom-preview">预览</div>',
                '    <div class="tui-custom-wordcount">0字</div>',
                '</div>'
            ].join(''));

            toolbarContainer.append([
                '<div class="tui-custom-button-md-syntax">',
                '    <a href="https://www.golang123.com/books/30/chapters/731" target="_blank">',
                '        Markdown语法?',
                '    </a>',
                '</div>'
            ].join(''));

            $('.te-toolbar-section').append([
                '<div class="mili-md-editor-tooltip" style="top: 36px; opacity: 0.6; display: none;">',
                '    <div class="mili-md-editor-tooltip-caret"></div>',
                '    <div class="mili-md-editor-tooltip-text">粗体</div>',
                '</div>'
            ].join(''));

            $('.tui-custom-button').bind('mouseenter', onShowToolTip);
            $('.tui-custom-button').bind('mouseleave', onHideToolTip);
            $('.tui-toolbar-icons').bind('mouseenter', onShowToolTip);
            $('.tui-toolbar-icons').bind('mouseleave', onHideToolTip);

            this.addToolbarImgItem();
        },
        addToolbarItem(editor, item) {
            const toolbar = editor.getUI().getToolbar();
            const btnData = {
                name: 'tui-custom-' + item.name,
                className: '',
                command: item.command,
                tooltip: '',
                $el: $(`<button class="tui-custom-button"><i class="mili-editor-icon-${item.name}"></i></button>`)
            };
            if (item.event) {
                btnData.event = item.event;
            }
            if (item.index) {
                toolbar.addButton(btnData, item.index);
            } else {
                toolbar.addButton(btnData);
            }
        },
        addToolbarImgItem() {
            const imgUploader = new Vue({
                render: h => h(UploaderPure, {
                    props: {},
                    ref: 'uploader',
                }),
            }).$mount('#customToolbarImgUploader');
            imgUploader.$refs.uploader.$on('formatError', this.onImgFormatError);
            imgUploader.$refs.uploader.$on('maxSizeError', this.onImgMaxSizeError);
            imgUploader.$refs.uploader.$on('error', this.onImgError);
            imgUploader.$refs.uploader.$on('success', this.onImgSuccess);
            $('#customToolbarImgUploaderBox').bind('click', function() {
                imgUploader.$refs.uploader.select();
            });
        },
        onImgFormatError(message) {
            this.postMessage('errorMsg', {
                message,
            });
        },
        onImgMaxSizeError(message) {
            this.postMessage('errorMsg', {
                message,
            });
        },
        onImgError(message) {
            this.postMessage('errorMsg', {
                message,
            });
        },
        onImgSuccess(url) {
            this.editor.insertText(`![图片](${url})`);
        },
        setWordCount(content) {
            clearTimeout(this.wordCountTimeoutId);
            this.wordCountTimeoutId = setTimeout(() => {
                const html = marked(content || '');
                const txt = trim(striptags(html));
                const wordCount = txt.length || 0;
                $('.tui-custom-wordcount').text(wordCount + '字');
            }, 1000);
        }
    },
    components: {
        UploaderPure,
    }
}
</script>