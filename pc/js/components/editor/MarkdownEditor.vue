<template>
    <div class="md-editor-body-box" :class="{'md-editor-no-padding-top': noPaddingTop}">
        <ErrorTip ref="errorTip" />
        <div class="md-editor-body">
            <iframe ref="editorFrame" src="/editor/markdown"></iframe>
        </div>
    </div>
</template>

<script>
// https://nhn.github.io/tui.editor/latest/

import ErrorTip from '~/js/components/common/ErrorTip.vue';

export default {
    props: [
        'noPaddingTop'
    ],
    data () {
        return {
            isReady: false,
            mdContent: '',
            messageCallbackProxy: null,
        }
    },
    methods: {
        getContent() {
            return this.mdContent;
        },
        setContent(content) {
            console.log('setContent', content);
            this.mdContent = content;
            this.postMessage('setContent', { content });
        },
        postMessage(action, data) {
            if (!this.isReady) {
                return;
            }
            this.$refs.editorFrame.contentWindow.postMessage({
                action,
                data,
            }, '*');
        },
        messageCallback(event) {
            if (!(event.data && event.data.action)) {
                return;
            }
            console.log('[MarkdownEditor]', JSON.stringify(event.data), new Date().getTime());
            switch (event.data.action) {
                case 'contentUpdated': {
                    this.mdContent = event.data.data.content;
                    break;
                }
                case 'ready': {
                    this.isReady = true;
                    this.postMessage('setContent', { content: this.mdContent });
                    break;
                }
                case 'errorMsg': {
                    this.$refs.errorTip.show(event.data.data.message);
                    break;
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.messageCallbackProxy = this.messageCallback.bind(this);
            window.addEventListener('message', this.messageCallbackProxy);
        });
    },
    beforeDestroy() {
        window.removeEventListener('message', this.messageCallbackProxy);
    },
    components: {
        ErrorTip,
    }
}
</script>

<style lang="scss" scoped>
.md-editor-body-box {
    width: 100%;
    height: 100%;
}

.md-editor-body {
    height: 100%;
    padding-top: 56px;
    padding-bottom: 0;
    box-sizing: border-box;
    font-size: 0;
    overflow: hidden;
}

.md-editor-no-padding-top .md-editor-body {
    padding-top: 0;
}

iframe {
    width: 100%;
    height: 100%;
}
</style>