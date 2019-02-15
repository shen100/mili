<template>
    <div id="scrolling-container">
        <div class="mili-editor">
            <RichEditorMenubar :editor="editor" />
            <textarea ref="titleDOM" @keydown.enter.stop.prevent="onTitleInputEnter" @input="onTitleInput($event)" 
                v-model="articleTitle" class="rich-title-input" type="text" placeholder="输入标题" ></textarea>
            <editor-content class="mili-editor-content" :editor="editor" />
        </div>
    </div>
</template>


<script>
import { Editor, EditorContent } from 'tiptap'
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
    Link,
    Strike,
    Underline,
    Placeholder,
} from 'tiptap-extensions';
import RichEditorMenubar from '~/js/components/common/RichEditorMenubar.vue';

export default {
    name: 'RichEditor',
    data () {
        return {
            articleTitle: '',
            editor: new Editor({
                extensions: [
                    new Blockquote(),
                    new BulletList(),
                    new CodeBlock(),
                    new HardBreak(),
                    new Heading({ levels: [1, 2, 3] }),
                    new HorizontalRule(),
                    new ListItem(),
                    new OrderedList(),
                    new Bold(),
                    new Code(),
                    new Italic(),
                    new Link(),
                    new Strike(),
                    new Underline(),
                    new Placeholder({
                        emptyClass: 'is-empty',
                        emptyNodeText: '请输入正文...',
                        showOnlyWhenEditable: true,
                    }),
                ],
                content: ''
            })
        };
    },
    beforeDestroy() {
        this.editor.destroy();
    },
    methods: {
        onTitleInputEnter(event) {
            console.log('onTitleInputEnter');
            this.articleTitle = this.articleTitle.replace('\n', '');
            this.editor.focus();
        },
        onTitleInput(event) {
            console.log('onTitleInput', event);
            this.$refs.titleDOM.style.height = this.$refs.titleDOM.scrollHeight + 'px';
        }
    },
    mounted() {
        this.$nextTick(() => {
        })
    },
    components: {
        EditorContent,
        RichEditorMenubar,
    },
}
</script>
