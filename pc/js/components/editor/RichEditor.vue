<template>
    <div class="mili-editor" :class="{'mili-admin-editor': mode === 'admin'}">
        <RichEditorMenubar :editor="editor" :mode="mode" />
        <textarea v-if="mode !== 'admin'" ref="titleDOM" @keydown.enter.stop.prevent="onTitleInputEnter" @input="onTitleInput($event)" 
            v-model="articleTitle" class="rich-title-input" type="text" placeholder="输入标题..." ></textarea>
        <editor-content class="mili-editor-content" :editor="editor" :style="{height: contentHeight}" />
    </div>
</template>

<script>
// https://www.npmjs.com/package/tiptap
// https://github.com/scrumpy/tiptap
// https://tiptap.scrumpy.io/

import { Editor, EditorContent } from 'tiptap';
import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    HorizontalRule,
    OrderedList,
    BulletList,
    ListItem,
    Bold,
    Code,
    Italic,
    Image,
    Link,
    Strike,
    Underline,
    Placeholder,
} from 'tiptap-extensions';
import MyHardBreak from '~/js/components/editor/MyHardBreak.js';
import RichEditorMenubar from '~/js/components/editor/RichEditorMenubar.vue';

export default {
    name: 'RichEditor',
    props: [
        'title',
        'content',
        'mode',
    ],
    data () {
        return {
            articleTitle: this.title || '',
            editor: new Editor({
                extensions: [
                    new Blockquote(),
                    new BulletList(),
                    new CodeBlock(),
                    new MyHardBreak(),
                    new Heading({ levels: [1, 2] }),
                    new HorizontalRule(),
                    new ListItem(),
                    new OrderedList(),
                    new Bold(),
                    new Code(),
                    new Italic(),
                    new Link(),
                    new Image(),
                    new Strike(),
                    new Underline(),
                    new Placeholder({
                        emptyClass: 'is-empty',
                        emptyNodeText: '请输入正文...',
                        showOnlyWhenEditable: true,
                    }),
                ],
                content: ''
            }),
            contentHeight: 'auto'
        };
    },
    beforeDestroy() {
        this.editor.destroy();
    },
    methods: {
        onTitleInputEnter() {
            this.articleTitle = this.articleTitle.replace('\n', '');
            this.editor.focus();
        },
        onTitleInput(event) {
            const scrollHeight = Math.min(this.$refs.titleDOM.scrollHeight, 80);
            this.$refs.titleDOM.style.height = scrollHeight + 'px';
        },
        getArticleTitle() {
            return this.articleTitle;
        },
        getHTML() {
            return this.editor.getHTML();
        },
        setHTML(html) {
            this.editor.setContent(html);
        },
        setContentHeight(contentHeight) {
            this.contentHeight = contentHeight + 'px';
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.editor.setContent(this.content);
        })
    },
    components: {
        EditorContent,
        RichEditorMenubar,
    },
}
</script>
