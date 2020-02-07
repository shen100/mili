<template>
    <div id="app">
        <div id="editorBox">
            <EditorHeader 
                :draftID="draftID"
                :articleID="articleID" 
                :initialTags="initialTags"
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
import RichEditor from '~/js/components/editor/RichEditor.vue';

export default {
    data () {
        let initialTitle = '';
        let initialContent = '';
        let initialTags;
        let draftID;
        let articleID;
        // draft 和 article 不会同时存在，有draft时是编辑草稿, 有article时是编辑文章
        // draft 和 article 都没有时，是新建草稿
        if (window.draft) {
            draftID = window.draft.id;
            initialTitle = window.draft.name;
            initialContent = window.draft.htmlContent;
            initialTags = window.draft.tags || [];
        }
        if (window.article) {
            initialTitle = window.article.name;
            initialContent = window.article.htmlContent;
            articleID = window.article.id;
            initialTags = window.article.tags || [];
        }
        return {
            userID: window.userID,
            avatarURL: window.avatarURL,
            initialTitle,
            initialContent,
            draftID,
            articleID,
            initialTags,
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
