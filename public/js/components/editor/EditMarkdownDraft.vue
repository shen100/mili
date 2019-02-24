<template>
    <div id="app">
        <ErrorTip ref="errorTip" />
        <div v-if="!isNewPublish" id="editorBox">
            <EditorHeader :userID="userID" :avatarURL="avatarURL" 
                :logoBoxWidth="logoBoxWidth"
                @on-publish="onPublish" />
            <MarkdownEditor @togglesidebyside="onToggleSideBySide" @input="onEditorInput"/>
        </div>
        <ArticlePublished v-else />
    </div>
</template>

<script>
import $ from 'jquery';
import EditorHeader from '~/js/components/editor/EditorHeader.vue';
import MarkdownEditor from '~/js/components/common/MarkdownEditor.vue';
import ArticlePublished from '~/js/components/article/ArticlePublished.vue';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import { ArticleContentType } from '~/js/constants/article.js';
import { myHTTP } from '~/js/common/net.js';
import { trim } from '~/js/utils/utils.js';

export default {
    data () {
        return {
            userID: window.userID,
            avatarURL: window.avatarURL,
            logoBoxWidth: 0,
            isNewPublish: false,
            articleID: '',
            articleTitle: '',
            articleContent: ''
        }
    },
    methods: {
        onPublish(categoryID, title) {
            this.articleTitle = trim(title);
            if (!this.articleTitle) {
                this.$refs.errorTip.show('请输入标题');
                return;
            }
            const url = '/articles';
            myHTTP.post(url, {
                name: this.articleTitle,
                content: this.articleContent,
                contentType: ArticleContentType.Markdown,
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
        },
        onEditorInput(content) {
            this.articleContent = content;
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
        this.$nextTick(function() {
        });
    },
    components: {
        EditorHeader,
        MarkdownEditor,
        ArticlePublished,
        ErrorTip,
    }
}
</script>
