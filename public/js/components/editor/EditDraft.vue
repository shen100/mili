<template>
    <div id="app">
        <ErrorTip ref="errorTip" />
        <div v-if="!isNewPublish" id="editorBox">
            <div class="editor-header">
                <div class="editor-logo-box" :style="{width: `${logoBoxWidth}px` }"></div>
                <input v-model="articleTitle" class="editor-title-input" :class="{'editor-title-input2': !mdEditorSideBySide}" type="text" placeholder="输入文章标题..." />
                <div class="navbar-user">
                    <div class="user">
                        <div data-hover="dropdown">
                            <a class="avatar" :href="`/u/${userID}.html`"><img :src="avatarURL"></a>
                        </div>
                        <ul class="dropdown-menu">
                            <li><a :href="`/u/${userID}.html`"><i class="iconfont ic-navigation-profile"></i><span>我的主页</span></a></li>
                            <li><a href="/bookmarks"><i class="iconfont ic-navigation-mark"></i><span>收藏的文章</span></a> </li>
                            <li><a href="/"><i class="iconfont ic-navigation-like"></i><span>喜欢的文章</span></a> </li>
                            <li><a href="/my/paid_notes"><i class="iconfont ic-paid"></i><span>已购内容</span></a> </li>
                            <li><a href="/wallet"><i class="iconfont ic-navigation-wallet"></i><span>我的钱包</span></a> </li>
                            <li><a href="/settings"><i class="iconfont ic-navigation-settings"></i><span>设置</span></a> </li>
                            <li><a href="/faqs"><i class="iconfont ic-navigation-feedback"></i><span>帮助与反馈</span></a> </li>
                            <li><a rel="nofollow" data-method="delete" href="/sign_out"><i class="iconfont ic-navigation-signout"></i><span>退出</span></a> </li>
                        </ul>
                    </div>
                </div>
                <a class="btn write-btn" @click="onPublish">
                    <i class="iconfont ic-write"></i>发布
                </a>
                <div class="editor-more-btn"><i class="iconfont ic-others"></i></div>
                <div class="upload-cover"><div></div></div>
                <div class="auto-save">文章将会自动保存至<a href="/editor/drafts">草稿</a></div>
            </div>
            <div class="editor-body" :class="{'md-editor-expand': !mdEditorSideBySide}">
                <MarkdownEditor :isSideBySide="mdEditorSideBySide" @input="onEditorInput" @change="onEditorContentChange"/>
            </div>
            <div class="editor-footer">
                <div class="editor-footer-left" :style="{width: mdEditorSideBySide ? '50%' : '100%'}">
                    <div class="markdown-btn">
                        <img src="../../../images/editor/markdown.svg">
                        <div class="shotcut-panel">
                            <span class="panel-title">快捷键</span>
                            <a href="https://www.appinn.com/markdown/" target="_blank" class="more-link">更多语法</a>
                            <div class="shotcut-table">
                                <div class="shotcut-row">
                                    <div class="shotcut-col0" style="font-weight: 700;">Markdown</div>
                                    <div class="shotcut-col1" style="font-weight: 700;">结果</div>
                                    <div class="shotcut-col2" style="font-weight: 700;">快捷键</div>
                                </div>
                                <div :key="i" v-for="(shotcutData, i) in shotcutArr" class="shotcut-row">
                                    <div :key="j" v-for="(item, j) in shotcutData" :class="'shotcut-col' + j"  v-html="item"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="uploadimg-btn"><img src="../../../images/editor/uploadimg.svg"></div>
                    <div v-if="mdEditorSideBySide" class="togglelayout-btn" @click="onToggleSideBySide">
                        <img src="../../../images/editor/togglelayout.svg" />
                    </div>
                    <div v-else class="togglelayout-btn" @click="onToggleSideBySide">
                        <img src="../../../images/editor/togglelayout2.svg" />
                    </div>
                </div>
                <div v-if="mdEditorSideBySide" class="editor-footer-right">
                    <div class="editor-footer-preview">预览</div>
                    <div class="editor-footer-wordcount">{{wordCount}}字</div>
                </div>
            </div>
        </div>
        <ArticleDone v-else />
    </div>
</template>

<script>
import $ from 'jquery';
import MarkdownEditor from '~/js/components/common/MarkdownEditor.vue';
import ArticleDone from '~/js/components/article/ArticleDone.vue';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import { trim } from '~/js/utils/utils.js';

export default {
    data () {
        return {
            userID: window.userID,
            avatarURL: window.avatarURL,
            wordCount: 0,
            shotcutArr: [
                [ '# 标题', 'H1', 'Ctrl / ⌘ + Shift + K' ],
                [ '## 标题', 'H2', 'Ctrl / ⌘ + Shift + K' ],
                [ '**文本**', '<b>粗体</b>', 'Ctrl / ⌘ + Shift + K' ],
                [ '[描述](http://)', '<a href="javascript:void(0);">链接</a>', 'Ctrl / ⌘ + Shift + K' ],
                [ '`code`', '<code>Inline Code</code>', 'Ctrl / ⌘ + Shift + K' ],
                [ '```code```', '<pre>Code</pre>', 'Ctrl / ⌘ + Shift + K' ],
                [ '![alt](http://)', '图片', 'Ctrl / ⌘ + Shift + K' ],
                [ '* item', '列表', 'Ctrl / ⌘ + Shift + K' ],
                [ '```code```', '<pre>Code</pre>', 'Ctrl / ⌘ + Shift + K' ]
            ],
            mdEditorSideBySide: true,
            logoBoxWidth: 0,
            isNewPublish: false,
            articleTitle: '',
            articleContent: ''
        }
    },
    methods: {
        onPublish() {
            this.articleTitle = trim(this.articleTitle);
            if (!this.articleTitle) {
                this.$refs.errorTip.show('请输入文章标题');
                return;
            }
        },
        onEditorInput(wordCount) {
            this.wordCount = wordCount;
        },
        onEditorContentChange(content) {
            this.articleContent = content;
        },
        onToggleSideBySide() {
            this.mdEditorSideBySide = !this.mdEditorSideBySide;
            this.logoBoxWidth = 0;
            if (!this.mdEditorSideBySide) {
                this.logoBoxWidth = ($(window).width() - 850) / 2;   
            }
        }
    },
    mounted () {
        this.$nextTick(function() {
            $('.navbar-user').mouseenter(function() {
                $('.navbar-user .user').addClass('open');
            });

            $('.navbar-user').mouseleave(function() {
                $('.navbar-user .user').removeClass('open');
            });
        });
    },
    components: {
        MarkdownEditor,
        ArticleDone,
        ErrorTip,
    }
}
</script>
