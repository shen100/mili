<template>
    <div id="scrolling-container">
        <div class="mili-editor">
            <RichEditorMenubar :editor="editor" />
            <textarea ref="titleDOM" @input="onTitleInput" class="rich-title-input" type="text" placeholder="输入标题" ></textarea>
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
        onTitleInput() {
            this.$refs.titleDOM.style.height = (this.$refs.titleDOM.scrollHeight - 30) + 'px';
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
