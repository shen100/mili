import Editor from 'tui-editor';

Editor.defineExtension('warning', function() {
    Editor.codeBlockManager.setReplacer('!', function (code) {
        return `<div class="warning"><div class="warning-circle"></div>${code}</div>`;
    });
});