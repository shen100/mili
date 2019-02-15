<template>
    <EditorMenuBar :editor="editor">
        <div class="mili-editor-menubar" slot-scope="{ commands, isActive }">
            <button
                :class="{ 'mili-editor-menubar-active': isActive.bold() }"
                @click="commands.bold">
                <i class="mili-editor-icon-bold"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.italic() }"
                @click="commands.italic">
                <i class="mili-editor-icon-italic"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.underline() }"
                @click="commands.underline">
                <i class="mili-editor-icon-underline"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-codeblock': isActive.code_block() }"
                @click="commands.code_block">
                <i class="mili-editor-icon-codeblock"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.code() }"
                @click="commands.code">
                <i class="mili-editor-icon-code"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.heading({ level: 1 }) }"
                @click="commands.heading({ level: 1 })">
                <i class="mili-editor-icon-h1"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.heading({ level: 2 }) }"
                @click="commands.heading({ level: 2 })">
                <i class="mili-editor-icon-h2"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.bullet_list() }"
                @click="commands.bullet_list">
                <i class="mili-editor-icon-ul"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.ordered_list() }"
                @click="commands.ordered_list">
                <i class="mili-editor-icon-ol"></i>
            </button>

            <button
                :class="{ 'mili-editor-menubar-active': isActive.blockquote() }"
                @click="commands.blockquote">
                <i class="mili-editor-icon-blockquote"></i>
            </button>
        </div>
    </EditorMenuBar>
</template>

<script>
/*
 * https://tiptap.scrumpy.io
 * https://github.com/scrumpy/tiptap
 */
import { EditorMenuBar } from 'tiptap';

export default {
    props: [
        'editor'
    ],
    data () {
        return {
        };
    },
    components: {
        EditorMenuBar,
    },
}
</script>