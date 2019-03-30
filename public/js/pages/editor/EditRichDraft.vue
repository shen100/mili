<template>
    <div id="app">
        <div id="editorBox">
            <EditorHeader 
                :draftID="draftID"
                :articleID="articleID" 
                :initialCategories="initialCategories"
                :getArticleTitle="getArticleTitle"
                :getEditorHTML="getEditorHTML" 
                :isRich="true" 
                :userID="userID" 
                :avatarURL="avatarURL"
                switchEditorLabel="Markdown" />
            <RichEditor :title="initialTitle" :content="initialContent" ref="richEditor" />
        </div>
    </div>
</template>

<script>
import EditorHeader from '~/js/components/editor/EditorHeader.vue';
import RichEditor from '~/js/components/common/editor/RichEditor.vue';

export default {
    data () {
        let initialTitle = '';
        let initialContent = '';
        let initialCategories;
        let draftID;
        let articleID;
        // draft 和 article 不会同时存在，有draft时是编辑草稿, 有article时是编辑文章
        // draft 和 article都没有时，是新建草稿
        if (window.draft) {
            draftID = window.draft.id;
            initialTitle = window.draft.name;
            initialContent = window.draft.htmlContent;
            initialCategories = window.draft.categories || [];
        }
        if (window.article) {
            initialTitle = window.article.name;
            initialContent = window.article.htmlContent;
            articleID = window.article.id;
            initialCategories = window.article.categories || [];
        }
        return {
            userID: window.userID,
            avatarURL: window.avatarURL,
            initialTitle,
            initialContent,
            draftID,
            articleID,
            initialCategories,
        };
    },
    methods: {
        getEditorHTML() {
            return this.$refs.richEditor.getHTML();
        },
        getArticleTitle() {
            return this.$refs.richEditor.getArticleTitle();
        }
    },
    components: {
        EditorHeader,
        RichEditor,
    }
}
</script>
