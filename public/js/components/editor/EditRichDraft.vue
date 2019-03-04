<template>
    <div id="app">
        <ArticlePublished v-if="displayNewPublish" />
        <div v-else id="editorBox">
            <EditorHeader 
                :draftID="draftID"
                :articleID="articleID" 
                :initialCategories="initialCategories"
                @newpublished="onNewPublished"
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
import RichEditor from '~/js/components/common/RichEditor.vue';
import ArticlePublished from '~/js/components/article/ArticlePublished.vue';

export default {
    data () {
        let initialTitle = '';
        let initialContent = '';
        let initialCategories;
        let draftID;
        let articleID;
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
            displayNewPublish: false,
            initialTitle,
            initialContent,
            draftID,
            articleID,
            initialCategories,
        };
    },
    methods: {
        onNewPublished() {
            this.displayNewPublish = true;
        },
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
        ArticlePublished,
    }
}
</script>
