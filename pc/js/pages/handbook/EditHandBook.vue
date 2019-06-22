<template>
    <div id="app">
        <AddChapterAlert ref="chapterTitleAlert" width="450" @ok="onChapterTitleOk" @cancel="onChapterTitleCancel" />
        <div id="editorBox">
            <HandbookHeader v-show="!isLoading"
                :title="initialTitle"
                :getEditorMarkdown="getEditorMarkdown"
                :userID="userID" 
                :avatarURL="avatarURL" />
            <div class="edit-wrap">
                <div class="directory-box">
                    <div @click="onSummaryClick" class="summary" :class="{'route-active': isSummarySelected}">小册介绍</div>
                    <div class="editor-directory editor-directory">
                        <div id="list" class="list">
                            <div class="list-transition">
                                <div class="item" :key="chapter.id"
                                    v-for="(chapter, i) in chapters"
                                    :class="{'route-active': curChapter && curChapter.id === chapter.id}">
                                    <div @click="onChapterClick(chapter)" class="item-cont">
                                        <div class="order">{{i + 1}}.</div>
                                        <div class="title"><div class="text">{{chapter.name || '小册章节标题'}}</div></div>
                                    </div>
                                    <div class="bar"><img src="../../../images/handbook/dir.svg"></div>
                                    <div v-clickoutside="onClickOutsideMoreMenu" :data-index="i" class="more">
                                        <div @click="onMoreToggle(i)" class="toggle-btn"><img src="../../../images/handbook/more.svg"></div>
                                        <div v-if="moreToggled[i].toggled" class="menu">
                                            <div @click="onUpdateChapterName(chapter, i)">修改标题</div>
                                            <div>设置为试读</div>
                                            <div>
                                                <label>
                                                    <span>本章节已完成</span>
                                                    <input type="checkbox" class="check">
                                                </label>
                                            </div>
                                            <div>删除</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button @click="onCreateChapter" class="btn-section">添加章节</button>
                    </div>
                </div>
                <div class="md-editor-body-box-wrap">
                    <MarkdownEditor
                        ref="mdEditor"
                        :content="initialContent" />
                </div>
            </div>
        </div>
        <GlobalLoading v-if="isLoading" />
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import GlobalLoading from '~/js/components/common/GlobalLoading';
import { getWindowSize } from '~/js/utils/dom.js';
import AddChapterAlert from '~/js/components/handbook/AddChapterAlert.vue';
import HandbookHeader from '~/js/components/handbook/HandbookHeader.vue';
import MarkdownEditor from '~/js/components/editor/MarkdownEditor.vue';

const defaultSummary = `## 作者介绍  

## 小册介绍  

## 你会学到什么？   

## 适宜人群  

## 购买须知  

1. 本小册为图文形式内容服务，共计 N 节；  
2. 全部文章预计 x 月 x 日更新完成；  
3. 购买用户可享有小册永久的阅读权限；  
4. 购买用户可进入小册微信群，与作者互动；  
5. 掘金小册为虚拟内容服务，一经购买成功概不退款；  
6. 掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；  
7. 在掘金小册阅读过程中，如有任何问题，请邮件联系 xiaoce@xitu.io  
`
export default {
    data () {
        const moreToggled = [];
        const chapters = window.chapters || [];
        for (let i = 0; i < chapters.length; i++) {
            chapters[i].isLoad = false;
            if (window.chapter && window.chapter.id === chapters[i].id) {
                chapters[i] = window.chapter;
                chapters[i].isLoad = true;
            }
            moreToggled.push({ toggled: false });
            chapters[i].content = chapters[i].content || '';
        }
        return {
            handbook: window.handbook,
            isSummarySelected: !window.chapter,
            chapters,
            userID: window.userID,
            avatarURL: window.avatarURL,
            initialTitle: window.handbook.name || '',
            initialContent: window.chapter && window.chapter.content || handbook.summary || defaultSummary,
            moreToggled,
            curChapter: window.chapter || null,
            isLoading: false,
        };
    },
    methods: {
        getEditorMarkdown() {
            return this.$refs.mdEditor.getContent();
        },
        onSummaryClick() {
            const content = this.getEditorMarkdown();
            // this.curChapter 为空，是小册介绍切到小册介绍, 直接返回
            if (!this.curChapter) {
                return;
            }
            // this.curChapter 不为空，是由章节切到小册介绍
            if (this.curChapter.content === content) {
                this.curChapter = null;
                this.isSummarySelected = true;
                return;
            }
            
            const url = `/handbooks/chapters/${this.curChapter.id}/content`;
            const data = {
                content,
            };
            this.isLoading = true;
            myHTTP.put(url, data).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.curChapter.content = content;
                    this.curChapter = null;
                    this.isSummarySelected = true;
                }
                this.isLoading = false;
            }).catch((err) => {
                this.isLoading = false;
            });
        },

        onChapterClick(chapter) {
            const content = this.getEditorMarkdown();
            // 由小册介绍切到章节
            if (this.isSummarySelected) {
                const putSummaryURL = `/handbooks/${this.handbook.id}/summary`;
                const getChapterURL = `/handbooks/chapters/${chapter.id}`;
                const reqData = {
                    summary: content,
                };

                this.isLoading = true;

                Promise.all([
                    content !== this.handbook.summary ? myHTTP.put(putSummaryURL, reqData) : Promise.resolve(true),
                    !chapter.isLoad ? myHTTP.get(getChapterURL) : Promise.resolve(true)
                ]).then((arr) => {
                    const [putRes, getRes] = arr;
                    const SUCCESS_CODE = ErrorCode.SUCCESS.CODE;
                    if ((putRes === true || putRes.data.errorCode === SUCCESS_CODE) 
                        && (getRes === true || getRes.data.errorCode === SUCCESS_CODE)) {
                        if (!chapter.isLoad) {
                            chapter.content = getRes.data.data.chapter.content;
                            chapter.isLoad = true;
                        }
                        this.curChapter = chapter;
                        this.isSummarySelected = false;
                        this.handbook.summary = content;
                    }
                    this.isLoading = false;
                }).catch((err) => {
                    console.log(err);
                    this.isLoading = false;
                });
                return;
            }

            // 由章节切到章节
            const oldCurChapter = this.curChapter;
            const putChapterURL = `/handbooks/chapters/${oldCurChapter.id}/content`;
            const getChapterURL = `/handbooks/chapters/${chapter.id}`;
            const reqData = {
                content,
            };

            this.isLoading = true;

            Promise.all([
                oldCurChapter.content !== content ? myHTTP.put(putChapterURL, reqData) : Promise.resolve(true),
                !chapter.isLoad ? myHTTP.get(getChapterURL) : Promise.resolve(true)
            ]).then((arr) => {
                const [putRes, getRes] = arr;
                const SUCCESS_CODE = ErrorCode.SUCCESS.CODE;
                if ((putRes === true || putRes.data.errorCode === SUCCESS_CODE) 
                    && (getRes === true || getRes.data.errorCode === SUCCESS_CODE)) {
                    if (!chapter.isLoad) {
                        chapter.content = getRes.data.data.chapter.content;
                        chapter.isLoad = true;
                    }
                    oldCurChapter.content = content;
                    this.curChapter = chapter;
                    this.isSummarySelected = false;
                }
                this.isLoading = false;
            }).catch((err) => {
                console.log(err);
                this.isLoading = false;
            });
        },

        onCreateChapter(chapter, index) {
            // 创建章节后，会选中新创建的章节，所以得事先保存当前选中的小册介绍或章节
            const content = this.getEditorMarkdown();
            if (this.isSummarySelected) {
                if (content === this.handbook.summary) {
                    this.$refs.chapterTitleAlert.show(this.chapters.length + 1, '', undefined);
                    return;
                }
                const putSummaryURL = `/handbooks/${this.handbook.id}/summary`;
                const reqData = {
                    summary: content,
                };
                this.isLoading = true;
                myHTTP.put(putSummaryURL, reqData).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        this.handbook.summary = content;
                        this.$refs.chapterTitleAlert.show(this.chapters.length + 1, '', undefined);
                    }
                    this.isLoading = false;
                    return;
                }).catch((err) => {
                    this.isLoading = false;
                });
            } else {
                const curChapter = this.curChapter;
                if (content === curChapter.content) {
                    this.$refs.chapterTitleAlert.show(this.chapters.length + 1, '', undefined);
                    return;
                }
                const putChapterURL = `/handbooks/chapters/${curChapter.id}/content`;
                const reqData = {
                    content,
                };
                this.isLoading = true;
                myHTTP.put(putChapterURL, reqData).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        this.curChapter.content = content;
                        this.$refs.chapterTitleAlert.show(this.chapters.length + 1, '', undefined);
                    }
                    this.isLoading = false;
                    return;
                }).catch((err) => {
                    this.isLoading = false;
                });
            }
        },
        onUpdateChapterName(chapter, index) {
            // 点击修改标题，出现修改章节标题的弹框，这时，并不会改变当前选中的章节或小册介绍
            this.moreToggled[index].toggled = false;
            this.$refs.chapterTitleAlert.show(index + 1, chapter.name || '', chapter.id);
        },
        onMoreToggle(index) {
            this.moreToggled[index].toggled = !this.moreToggled[index].toggled;
        },
        onClickOutsideMoreMenu(event, dataset) {
            this.moreToggled[dataset.index].toggled = false;
        },
        onChapterTitleOk(data) {
            // 修改章节的标题
            if (data.chapterID) {
                const url = `/handbooks/chapters/${data.chapterID}/title`;
                const reqData = {
                    name: data.chapterTitle,
                };
                this.isLoading = true;
                myHTTP.put(url, reqData).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        for (let i = 0; i < this.chapters.length; i++) {
                            if (this.chapters[i].id === data.chapterID) {
                                this.chapters[i].name = res.data.data.name;
                                break;
                            }
                        }
                    }
                    this.isLoading = false;
                }).catch((err) => {
                    console.log(err);
                    this.isLoading = false;
                });
                return;
            }

            // 新建章节
            const url = `/handbooks/${this.handbook.id}/chapters`;
            this.isLoading = true;
            myHTTP.post(url, { name: data.chapterTitle }).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    const newChapter = {
                        id: res.data.data.id,
                        name: res.data.data.name,
                        content: ''
                    };
                    this.chapters.push(newChapter);
                    this.moreToggled.push({ toggled: false });
                    this.curChapter = newChapter;
                    this.isSummarySelected = false;
                }
                this.isLoading = false;
            }).catch((err) => {
                this.isLoading = false;
            });
        },
        onChapterTitleCancel() {

        }
    },
    mounted () {
    },
    computed: {
        summaryDisplay() {
            return handbook.summary || defaultSummary;
        }
    },
    watch: {
        curChapter(newVal, oldVal) {
            if (newVal === oldVal) {
                return;
            }
            // newVal为空，说明点击的是小册介绍
            if (!newVal) {
                this.$refs.mdEditor.setContent(this.summaryDisplay);
                return;
            }
            this.$refs.mdEditor.setContent(newVal.content || '');
        }
    },
    components: {
        GlobalLoading,
        HandbookHeader,
        MarkdownEditor,
        AddChapterAlert,
    }
}
</script>
