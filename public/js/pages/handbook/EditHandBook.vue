<template>
    <div id="app">
        <AddChapterAlert ref="chapterTitleAlert" width="450" @ok="onChapterTitleOk" @cancel="onChapterTitleCancel" />
        <div id="editorBox">
            <HandbookHeader 
                :title="initialTitle"
                :getEditorMarkdown="getEditorMarkdown"
                :userID="userID" 
                :avatarURL="avatarURL" />
            <div class="edit-wrap">
                <div class="directory-box">
                    <div @click="onSummaryClick" class="summary" :class="{'route-active': !curChapter}">小册介绍</div>
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
                                            <div @click="updateChapterName(chapter, i)">修改标题</div>
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
                        <button @click="updateChapterName()" class="btn-section">添加章节</button>
                    </div>
                </div>
                <div class="md-editor-body-box-wrap">
                    <MarkdownEditor
                        ref="mdEditor"
                        :content="initialContent" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import { getWindowSize } from '~/js/utils/dom.js';
import AddChapterAlert from '~/js/components/handbook/AddChapterAlert.vue';
import HandbookHeader from '~/js/components/handbook/HandbookHeader.vue';
import MarkdownEditor from '~/js/components/editor/MarkdownEditor.vue';

export default {
    data () {
        const moreToggled = [];
        const chapters = window.chapters || [];
        chapters.map(() => moreToggled.push({ toggled: false }));
        return {
            handbook: window.handbook,
            chapters,
            userID: window.userID,
            avatarURL: window.avatarURL,
            initialTitle: '',
            initialContent: '',
            moreToggled,
            curChapter: null,
        };
    },
    methods: {
        getEditorMarkdown() {
            return this.$refs.mdEditor.getContent();
        },
        onSummaryClick() {
            this.curChapter = null;
        },
        onChapterClick(chapter) {
            this.curChapter = chapter;
        },
        updateChapterName(chapter, index) {
            let order = this.chapters.length + 1;
            let chapterName = chapter && chapter.name || '';
            let chapterID = undefined;
            if (chapter) {
                order = index + 1;
                chapterName = chapter.name;
                chapterID = chapter.id;
                this.moreToggled[index].toggled = false;
            }
            this.$refs.chapterTitleAlert.show(order, chapterName, chapterID);
        },
        onMoreToggle(index) {
            this.moreToggled[index].toggled = !this.moreToggled[index].toggled;
        },
        onClickOutsideMoreMenu(event, dataset) {
            console.log('dataset', dataset);
            this.moreToggled[dataset.index].toggled = false;
        },
        onChapterTitleOk(data) {
            if (data.chapterID) {
                const url = `/handbooks/chapters/${data.chapterID}/title`;
                const reqData = {
                    name: data.chapterTitle,
                };
                myHTTP.put(url, reqData).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        for (let i = 0; i < this.chapters.length; i++) {
                            if (this.chapters[i].id === data.chapterID) {
                                this.chapters[i].name = res.data.data.name;
                                break;
                            }
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
                return;
            } else {
                const url = `/handbooks/${this.handbook.id}/chapters`;
                myHTTP.post(url).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        this.chapters.push({
                            id: res.data.data.id,
                        });
                        this.moreToggled.push({ toggled: false });
                    }
                }).catch((err) => {
                });
            }
        },
        onChapterTitleCancel() {

        }
    },
    mounted () {
    },
    components: {
        HandbookHeader,
        MarkdownEditor,
        AddChapterAlert,
    }
}
</script>
