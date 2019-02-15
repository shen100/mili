<template>
    <div class="mili-editor">
        <textarea style="border: none;" ref="textarea"></textarea>
    </div>
</template>

<script>
import marked from 'marked';
import striptags from 'striptags';

export default {
    props: [
        'value',
        'isSideBySide'
    ],
    data () {
        return {
            SimpleMDE: null,
            simplemde: null
        }
    },
    methods: {
        initSimplemde() {
            const SimpleMDE = window.SimpleMDE;
            this.SimpleMDE = SimpleMDE;
            let simplemde = new SimpleMDE({
                element: this.$refs.textarea,
                autoDownloadFontAwesome: true,
                autosave: {
                    enabled: false
                },
                indentWithTabs: false,
                initialValue: this.value || '',
                // placeholder: Custom placeholder that should be displayed
                promptURLs: false,
                codeSyntaxHighlighting: true,
                spellChecker: false,
                status: false,
                toolbar: false,
                previewRender: this.previewRender.bind(this)
            })
            this.simplemde = simplemde;
            var pt = SimpleMDE.prototype
            if (!pt.getImageURL) {
                pt.getImageURL = function () {
                    return this.theImageURL;
                }
                pt.setImageURL = function (url) {
                    this.theImageURL = url;
                }
            }
            var self = this
            this.simplemde.codemirror.on('change', function () {
                self.$emit('change', self.simplemde.value())
            })
            this.simplemde.toggleSideBySide();
        },
        insertImage() {
            this.simplemde.setImageURL(imgURL);
            this.SimpleMDE.drawImage(this.simplemde);
        },
        previewRender(plainText, preview) {
            const stripedText = striptags(plainText || '');
            // preview.innerHTML = plainText;
            this.$emit('input', stripedText.length);
            return marked(plainText);
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initSimplemde();
        })
    },
    watch: {
        value: function (newVal, oldVal) {
            newVal = newVal || ''
            if (newVal !== this.simplemde.value()) {
                this.simplemde.value(newVal)
            }
        },
        isSideBySide: function (newVal, oldVal) {
            console.log('--------------', newVal, oldVal);
            if (newVal !== oldVal) {
                this.simplemde.toggleSideBySide();
            }
        }
    }
}
</script>
