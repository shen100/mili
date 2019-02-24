<template>
    <div class="mili-editor">
        <RichEditorMenubar :editor="editor" />
        <textarea ref="titleDOM" @keydown.enter.stop.prevent="onTitleInputEnter" @input="onTitleInput($event)" 
            v-model="articleTitle" class="rich-title-input" type="text" placeholder="输入标题..." ></textarea>
        <editor-content class="mili-editor-content" :editor="editor" />
    </div>
</template>

<script>
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
import RichEditorMenubar from '~/js/components/common/RichEditorMenubar.vue';

import { Node } from 'tiptap'
import { chainCommands, exitCode } from 'tiptap-commands'

class MyHardBreak extends HardBreak {
    get name() {
        return 'my_hard_break';
    }

    commands({ type }) {
        return attrs => (state, dispatch) => {
            const { selection } = state;
            let position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos;
            if (attrs && attrs.isCodeBlock) {
                position = position + 1;
            }
            const node = type.create(attrs);
            const transaction = state.tr.insert(position, node);
            dispatch(transaction);
        }
    }
}

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
                    // new HardBreak(),
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
            })
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
            this.$refs.titleDOM.style.height = this.$refs.titleDOM.scrollHeight + 'px';
        },
        getArticleTitle() {
            return this.articleTitle;
        },
        getHTML() {
            return this.editor.getHTML();
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
