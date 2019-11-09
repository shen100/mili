<template>
    <div id="app">
        <div id="editorBox">
            <EditorHeader 
                :draftID="draftID"
                :articleID="articleID"
                :title="initialTitle"
                :initialCategories="initialCategories"
                :initialTags="initialTags"
                :getEditorMarkdown="getEditorMarkdown"
                :isRich="false" 
                :userID="userID" 
                :avatarURL="avatarURL" 
                switchEditorLabel="富文本"
                :logoBoxWidth="logoBoxWidth" />
            <MarkdownEditor 
                ref="mdEditor"
                :content="initialContent" 
                @togglesidebyside="onToggleSideBySide" />
        </div>
    </div>
</template>

<script>
import { getWindowSize } from '~/js/utils/dom.js';
import EditorHeader from '~/js/components/editor/EditorHeader.vue';
import MarkdownEditor from '~/js/components/editor/MarkdownEditor.vue';

export default {
    data () {
        let initialTitle = '';
        let initialContent = '';
        let initialCategories;
        let initialTags;
        let draftID;
        let articleID;
        // draft 和 article 不会同时存在，有draft时是编辑草稿, 有article时是编辑文章
        // draft 和 article 都没有时，是新建草稿
        if (window.draft) {
            draftID = window.draft.id;
            initialTitle = window.draft.name;
            initialContent = window.draft.content;
            initialCategories = window.draft.categories || [];
            initialTags = window.draft.tags || [];
        }
        if (window.article) {
            initialTitle = window.article.name;
            initialContent = window.article.content;
            articleID = window.article.id;
            initialCategories = window.article.categories || [];
            initialTags = window.article.tags || [];
        }
        return {
            userID: window.userID,
            avatarURL: window.avatarURL,
            logoBoxWidth: 0,
            initialContent,
            initialTitle,
            draftID,
            articleID,
            initialCategories,
            initialTags,
        };
    },
    methods: {
        getEditorMarkdown() {
            return this.$refs.mdEditor.getContent();
        },
        onToggleSideBySide(isSideBySide) {
            this.logoBoxWidth = 0;
            if (!isSideBySide) {
                // 隐藏预览区时, 编辑区的宽度是 850, 标题输入框的左内边距是12
                const winSize = getWindowSize();
                this.logoBoxWidth = (winSize.width - 850) / 2 - 12;
            }
        }
    },
    mounted () {
    },
    components: {
        EditorHeader,
        MarkdownEditor,
    }
}
</script>
