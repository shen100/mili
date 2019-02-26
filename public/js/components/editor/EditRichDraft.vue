<template>
    <div id="app">
        <ErrorTip ref="errorTip" />
        <div v-if="!isNewPublish" id="editorBox">
            <EditorHeader @on-publish="onPublish" :isRich="true" :userID="userID" :avatarURL="avatarURL" />
            <RichEditor ref="richEditor" />
        </div>
        <ArticlePublished v-else />
    </div>
</template>

<script>
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import EditorHeader from '~/js/components/editor/EditorHeader.vue';
import RichEditor from '~/js/components/common/RichEditor.vue';
import ArticlePublished from '~/js/components/article/ArticlePublished.vue';
import { trim } from '~/js/utils/utils.js';
import { myHTTP } from '~/js/common/net.js';
import { ArticleContentType } from '~/js/constants/article.js';

export default {
    data () {
        return {
            userID: window.userID,
            avatarURL: window.avatarURL,
            isNewPublish: false,
            articleID: '',
            articleTitle: '',
            articleContent: ''
        };
    },
    methods: {
        autoSaveDraft() {

        },
        onPublish(categoryID) {
            this.articleTitle = trim(this.$refs.richEditor.getArticleTitle());
            if (!this.articleTitle) {
                this.$refs.errorTip.show('请输入标题');
                return;
            }
            this.articleContent = this.$refs.richEditor.getHTML();
            const url = '/articles';
            myHTTP.post(url, {
                name: this.articleTitle,
                content: this.articleContent,
                contentType: ArticleContentType.HTML,
                categories: [
                    { id: categoryID }
                ]
            }).then((res) => {
                const result = res.data;
                if (result.errorCode) {
                    this.$refs.errorTip.show(result.message);
                    return;
                }
                if (!this.articleID) {
                    this.isNewPublish = true;
                }
            });
        }
    },
    mounted () {
        this.$nextTick(function() {
        });
        this.autoSaveDraft();
    },
    components: {
        EditorHeader,
        RichEditor,
        ErrorTip,
        ArticlePublished,
    }
}
</script>
