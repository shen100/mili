<template>
    <div id="app">
        <ArticlePublished v-if="displayNewPublish" />
        <div v-else id="editorBox">
            <EditorHeader 
                @newpublished="onNewPublished"
                :getArticleTitle="getArticleTitle"
                :getEditorHTML="getEditorHTML" 
                :isRich="true" 
                :userID="userID" 
                :avatarURL="avatarURL"
                editorTypeLabel="富文本" />
            <RichEditor ref="richEditor" />
        </div>
    </div>
</template>

<script>
import EditorHeader from '~/js/components/editor/EditorHeader.vue';
import RichEditor from '~/js/components/common/RichEditor.vue';
import ArticlePublished from '~/js/components/article/ArticlePublished.vue';

export default {
    data () {
        return {
            userID: window.userID,
            avatarURL: window.avatarURL,
            displayNewPublish: false
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
