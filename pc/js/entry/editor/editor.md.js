import 'codemirror/lib/codemirror.css';
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
import 'highlight.js/styles/github.css';

import '~/styles/article/articleDisplay.scss';
import '~/styles/editor/md.editor.frame.scss';

import Editor from 'tui-editor';
import 'tui-editor/dist/tui-editor-extScrollSync';
import '~/js/components/editor/tui-editor-ext';

import Vue from 'vue';
import MarkdownEditorMenubar from '~/js/components/editor/MarkdownEditorMenubar';

function postMessage(action, data) {
    if (window.parent === window.self) {
        return;
    }
    window.parent.postMessage({
        action,
        data,
    }, '*');
}

let customMenubar;

const editor = new Editor({
    el: document.querySelector('#app'),
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    usageStatistics: false, // 禁用 Google Analytics (GA)统计
    language: 'zh_CN',
    height: '100%',
    hideModeSwitch: true, // hide mode switch tab bar
    toolbarItems: ['link'],
    exts: ['scrollSync', 'warning'],
    placeholder: '请输入内容...',
    events: {
        change: () => {
            console.log('[editor.md.js] change', editor.getMarkdown(), new Date().getTime());
            const markdown = editor.getMarkdown();
            postMessage('contentUpdated', {
                content: markdown,
            });
            customMenubar && customMenubar.$refs.toolbar.setWordCount(markdown);
        }
    }
});

customMenubar = new Vue({
    render: h => h(MarkdownEditorMenubar, {
        props: {
            editor,
            postMessage,
        },
        ref: 'toolbar'
    }),
}).$mount('#menubar');

window.addEventListener('message', (event) => {
    if (!(event.data && event.data.action)) {
        return;
    }
    console.log('[editor.md.js]', JSON.stringify(event.data));
    switch (event.data.action) {
        case 'setContent': {
            console.log('[editor.md.js] setContent', new Date().getTime());
            editor.setMarkdown(event.data.data.content);
            // 可能出现以下的调用顺序
            // [MarkdownEditor] {"action":"ready"}
            // [editor.md.js] change
            // [editor.md.js] {"action":"setContent","data":{"content":"aaa"}}
            // [MarkdownEditor] {"action":"contentUpdated","data":{"content":""}}

            // 这行代码是为了兼容上面那种调用顺序，tui.editor少了一次change事件
            postMessage('contentUpdated', {
                content: event.data.data.content,
            });
            customMenubar && customMenubar.$refs.toolbar.setWordCount(event.data.data.content);
            break;
        }
    }
}, false);

console.log('postMessage ready', new Date().getTime());

postMessage('ready');
