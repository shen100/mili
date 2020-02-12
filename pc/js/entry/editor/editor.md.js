import '~/styles/editor/md.editor.frame.scss';

import 'codemirror/lib/codemirror.css';
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
import 'highlight.js/styles/github.css';

import Editor from 'tui-editor';
import 'tui-editor/dist/tui-editor-extScrollSync';

function postMessage(action, data) {
    window.parent.postMessage({
        action,
        data,
    }, '*');
}

const editor = new Editor({
    el: document.querySelector('#app'),
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    language: 'zh_CN',
    height: '100%',
    hideModeSwitch: true,
    toolbarItems: [],
    exts: ['scrollSync'],
    placeholder: '请输入内容...',
    events: {
        change: () => {
            console.log('[editor.md.js] change', editor.getMarkdown(), new Date().getTime());
            postMessage('contentUpdated', {
                content: editor.getMarkdown(),
            });
        }
    }
});

window.addEventListener('message', (event) => {
    if (!(event.data && event.data.action)) {
        return;
    }
    console.log('[editor.md.js]', JSON.stringify(event.data));
    switch (event.data.action) {
        case 'addImage': {
            editor.insertText(`![Alt text](${event.data.data.imgURL})`);
            break;
        }
        case 'setContent': {
            console.log('[editor.md.js] setContent', new Date().getTime());
            editor.setMarkdown(event.data.data.content);
            postMessage('contentUpdated', {
                content: event.data.data.content,
            });
            break;
        }
    }
}, false);

console.log('postMessage ready', new Date().getTime());

postMessage('ready');
