<template>
    <div id="app">
        <ErrorTip ref="errorTip" />
        <div v-if="!isNewPublish" id="editorBox">
            <EditorHeader :isRich="true" :userID="userID" :avatarURL="avatarURL" :mdEditorSideBySide="false" />
            <div class="editor-body" :class="{'md-editor-expand': true}">
                <RichEditor />
            </div>
        </div>
        <ArticlePublished v-else />
    </div>
</template>

<script>
import $ from 'jquery';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import EditorHeader from '~/js/components/editor/EditorHeader.vue';
import RichEditor from '~/js/components/common/RichEditor.vue';
import ArticlePublished from '~/js/components/article/ArticlePublished.vue';

export default {
    data () {
        return {
            userID: window.userID,
            avatarURL: window.avatarURL,
            logoBoxWidth: 0,
            isNewPublish: false
        };
    },
    components: {
        EditorHeader,
        RichEditor,
        ErrorTip,
        ArticlePublished,
    }
}
</script>
