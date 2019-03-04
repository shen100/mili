<template>
    <div id="app">
        <ArticlePublished v-if="displayNewPublish" />
        <div v-else id="editorBox">
            <EditorHeader 
                @newpublished="onNewPublished"
                :userID="userID" 
                :avatarURL="avatarURL" 
                switchEditorLabel="富文本"
                :logoBoxWidth="logoBoxWidth"
                :getEditorMarkdown="getEditorMarkdown" />
            <MarkdownEditor @togglesidebyside="onToggleSideBySide" @input="onEditorInput"/>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import EditorHeader from '~/js/components/editor/EditorHeader.vue';
import MarkdownEditor from '~/js/components/common/MarkdownEditor.vue';
import ArticlePublished from '~/js/components/article/ArticlePublished.vue';

export default {
    data () {
        return {
            userID: window.userID,
            avatarURL: window.avatarURL,
            displayNewPublish: false,
            logoBoxWidth: 0,
            articleContent: ''
        };
    },
    methods: {
        onNewPublished() {
            this.displayNewPublish = true;  
        },
        onEditorInput(content) {
            this.articleContent = content;
        },
        getEditorMarkdown() {
            return this.articleContent;
        },
        onToggleSideBySide(isSideBySide) {
            this.logoBoxWidth = 0;
            if (!isSideBySide) {
                // 隐藏预览区时, 编辑区的宽度是 850, 标题输入框的左内边距是12
                this.logoBoxWidth = ($(window).width() - 850) / 2 - 12;
            }
        }
    },
    mounted () {
    },
    components: {
        EditorHeader,
        MarkdownEditor,
        ArticlePublished,
    }
}
</script>
