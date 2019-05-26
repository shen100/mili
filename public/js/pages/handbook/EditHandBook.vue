<template>
    <div id="app">
        <div id="editorBox">
            <HandbookHeader 
                :title="initialTitle"
                :getEditorMarkdown="getEditorMarkdown"
                :userID="userID" 
                :avatarURL="avatarURL" />
            <MarkdownEditor 
                ref="mdEditor"
                :content="initialContent" 
                @togglesidebyside="onToggleSideBySide" />
        </div>
    </div>
</template>

<script>
import dom from '~/js/utils/dom.js';
import HandbookHeader from '~/js/components/handbook/HandbookHeader.vue';
import MarkdownEditor from '~/js/components/editor/MarkdownEditor.vue';

export default {
    data () {
        return {
            userID: window.userID,
            avatarURL: window.avatarURL,
            initialTitle: '',
            initialContent: '',
        };
    },
    methods: {
        getEditorMarkdown() {
            return this.$refs.mdEditor.getContent();
        },
        onToggleSideBySide(isSideBySide) {
            if (!isSideBySide) {
                // 隐藏预览区时, 编辑区的宽度是 850, 标题输入框的左内边距是12
                this.logoBoxWidth = ($(window).width() - 850) / 2 - 12;
            }
        }
    },
    mounted () {
    },
    components: {
        HandbookHeader,
        MarkdownEditor,
    }
}
</script>
