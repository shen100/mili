<template>
    <div id="app">
        <Alert ref="delChapterAlert" width="450" 
            @ok="onDelChapterOk" @cancel="onDelChapterCancel" />
        <AddChapterAlert ref="chapterTitleAlert" width="450" @ok="onChapterTitleOk" @cancel="onChapterTitleCancel" />
        <div id="editorBox">
            <HandbookHeader ref="handbookHeader" :siteName="siteName"
                :userID="userID" :avatarURL="avatarURL"
                :saveIntroduceOrChapter="saveIntroduceOrChapter" />
            <div class="edit-wrap">
                <div class="directory-box">
                    <div @click="onIntroduceClick" class="summary" :class="{'route-active': isIntroduceSelected}">小册介绍</div>
                    <div class="editor-directory editor-directory">
                        <div id="list" class="list">
                            <div class="list-transition">
                                <div class="item" :key="chapter.id"
                                    v-for="(chapter, i) in chapters"
                                    :class="{'route-active': curChapter && curChapter.id === chapter.id}">
                                    <div @click="onChapterClick(chapter)" class="item-cont">
                                        <div class="order">{{i + 1}}.</div>
                                        <div class="title">
                                            <div class="text">{{chapter.name || '小册章节标题'}}</div>
                                            <div v-if="chapter.tryRead" class="to-read">试读</div>
                                        </div>
                                    </div>
                                    <div v-clickoutside="onClickOutsideMoreMenu" :data-index="i" class="more">
                                        <div @click="onMoreToggle(i)" class="toggle-btn"><img src="../../../images/handbook/more.svg"></div>
                                        <div v-if="moreToggled[i].toggled" class="menu">
                                            <div @click="onUpdateChapterName(chapter, i)">修改标题</div>
                                            <div @click="onUpdateChapterTryRead(chapter, i)">{{!chapter.tryRead ? '设置为试读' : '取消试读'}}</div>
                                            <!-- <div>
                                                <label>
                                                    <span>本章节已完成</span>
                                                    <input type="checkbox" class="check">
                                                </label>
                                            </div> -->
                                            <div @click="onDeleteChapter(chapter.id)">删除</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button @click="onCreateChapter" class="btn-section">添加章节</button>
                    </div>
                </div>
                <div class="md-editor-body-box-wrap">
                    <MarkdownEditor ref="mdEditor" />
                </div>
            </div>
        </div>
        <GlobalLoading v-if="isLoading" />
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import Alert from '~/js/components/common/Alert.vue';
import GlobalLoading from '~/js/components/common/GlobalLoading';
import { getWindowSize } from '~/js/utils/dom.js';
import AddChapterAlert from '~/js/components/handbook/AddChapterAlert.vue';
import HandbookHeader from '~/js/components/handbook/HandbookHeader.vue';
import MarkdownEditor from '~/js/components/editor/MarkdownEditor.vue';

export default {
    data () {
        return {
            userID: window.userID,
            avatarURL: window.avatarURL,
            siteName: window.siteName,
            handbook: null,
            isIntroduceSelected: true, // 是否选中小册介绍
            chapters: [],
            chapterMap: {},
            moreToggled: [], // 分别表示章节的 "更多按钮" 是否激活，激活的话，会显示相应的下拉列表
            curChapter: null,
            delChapterID: 0,
            isLoading: false,
        };
    },
    mounted () {
        const { handbookID, chapterID } = this.$route.params;
        Promise.all([
            this.requestHandbook(handbookID),
            this.requestChapters(handbookID),
            chapterID !== 'introduce' ? this.requestChapterDetail(chapterID) : Promise.resolve(null),
        ]).then(arr => {
            const [ handbook, chapters, curChapter ] = arr;
            if (chapterID === 'introduce') {
                this.$refs.mdEditor.setContent(handbook.introduce || '');
            } else {
                curChapter.content = curChapter.content || '';
            }
            for (let i = 0; i < chapters.length; i++) {
                chapters[i].isLoad = false; // 章节内容是否已加载
                if (chapters[i].id === chapterID) {
                    chapters[i] = curChapter;
                    chapters[i].isLoad = true;
                }
                this.moreToggled.push({ toggled: false });
                chapters[i].content = chapters[i].content || '';
                this.chapterMap[chapters[i].id] = chapters[i];
            }
            this.handbook = handbook;
            this.chapters = chapters;
            this.curChapter = curChapter;
            this.$refs.handbookHeader.setHandBook(handbook);
        });
    },
    methods: {
        requestHandbook(id) {
            return myHTTP.get(`/handbooks/${id}`).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    return res.data.data;
                }
            });
        },
        requestChapters(id) {
            return myHTTP.get(`/handbooks/${id}/chapters`).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    return res.data.data;
                }
            });
        },
        requestChapterDetail(id) {
            myHTTP.get(`/handbooks/chapters/${id}`).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    return res.data.data;
                }
            });
        },
        getEditorMarkdown() {
            return this.$refs.mdEditor.getContent();
        },
        // 切到小册介绍
        onIntroduceClick() {
            const content = this.getEditorMarkdown();

            // this.curChapter 为空，是小册介绍 切到 小册介绍, 直接返回
            if (!this.curChapter) {
                return;
            }
            // this.curChapter 不为空，是由 章节 切到 小册介绍
            if (this.curChapter.content === content) {
                this.curChapter = null;
                this.isIntroduceSelected = true;
                return;
            }
            
            // 切到小册介绍前，先保存章节内容
            const url = `/handbooks/chapters/${this.curChapter.id}/content`;
            this.isLoading = true;
            myHTTP.put(url, { content }).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.curChapter.content = content;
                    this.curChapter = null;
                    this.isIntroduceSelected = true;
                }
                this.isLoading = false;
            }).catch((err) => {
                this.isLoading = false;
            });
        },
        // 保存当前选中的章节，或保存当前选中的小册介绍
        saveIntroduceOrChapter(chapter) {
            const content = this.getEditorMarkdown();
            // 当前选中的是小册介绍
            if (this.isIntroduceSelected) {
                if (content === this.handbook.introduce) {
                    return Promise.resolve({ data: { errorCode: ErrorCode.SUCCESS.CODE } });
                }
                const url = `/handbooks/${this.handbook.id}/introduce`;
                return myHTTP.put(url, { introduce: content }).then(res => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        this.handbook.introduce = content;
                    }
                    return Promise.resolve(res);
                });
            }
            const oldCurChapter = this.curChapter;
            if (oldCurChapter.content === content) {
                return Promise.resolve({ data: { errorCode: ErrorCode.SUCCESS.CODE } });
            }
            const url = `/handbooks/chapters/${oldCurChapter.id}/content`;
            return myHTTP.put(url, { content: content || '' }).then(res => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    oldCurChapter.content = content;
                }
                return Promise.resolve(res);
            });
        },
        onChapterClick(chapter) {
            this.isLoading = true;
            this.saveIntroduceOrChapter().then((res) => {
                if (res.data.errorCode !== ErrorCode.SUCCESS.CODE) {
                    throw new Error(res.data.message);
                }
                if (chapter.isLoad) {
                    return {
                        data: {
                            errorCode: ErrorCode.SUCCESS.CODE,
                            data: chapter,
                        }
                    };
                }
                return myHTTP.get(`/handbooks/chapters/${chapter.id}`);
            }).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    chapter.content = res.data.data.content || '';
                    this.curChapter = chapter;
                    this.curChapter.isLoad = true;
                    this.isIntroduceSelected = false;
                }
                this.isLoading = false;
            }).catch(err => {
                this.isLoading = false;
            });
        },
        // 显示创建章节的弹框
        onCreateChapter(chapter, index) {
            this.$refs.chapterTitleAlert.show(this.chapters.length + 1, '', undefined);
        },
        // 创建章节，或修改章节的标题
        onChapterTitleOk(data) {
            // 修改章节的标题
            if (data.chapterID) {
                this.isLoading = true;
                const url = `/handbooks/chapters/${data.chapterID}/title`;
                myHTTP.put(url, { name: data.chapterTitle }).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        this.chapterMap[data.chapterID].name = res.data.data.name || '';
                    }
                    this.isLoading = false;
                }).catch((err) => {
                    console.log(err);
                    this.isLoading = false;
                });
                return;
            }

            // 创建章节时，先保存当前选中的小册介绍或章节，再选中新创建的章节
            this.isLoading = true;
            this.saveIntroduceOrChapter().then((res) => {
                if (res.data.errorCode !== ErrorCode.SUCCESS.CODE) {
                    throw new Error(res.data.message);
                }
                // 新建章节
                const url = `/handbooks/${this.handbook.id}/chapters`;
                this.isLoading = true;
                myHTTP.post(url, { name: data.chapterTitle }).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        const newChapter = {
                            id: res.data.data.id,
                            name: res.data.data.name,
                            content: '',
                            isLoad: true
                        };
                        this.chapters.push(newChapter);
                        this.moreToggled.push({ toggled: false });
                        this.curChapter = newChapter;
                        this.chapterMap[newChapter.id] = newChapter;
                        this.isIntroduceSelected = false;
                    }
                    this.isLoading = false;
                }).catch((err) => {
                    this.isLoading = false;
                });
            }).catch(err => {
                this.isLoading = false;
            });
        },
        onUpdateChapterName(chapter, index) {
            this.moreToggled[index].toggled = false;
            this.$refs.chapterTitleAlert.show(index + 1, chapter.name || '', chapter.id);
        },
        onDeleteChapter(id) {
            this.delChapterID = id;
            this.$refs.delChapterAlert.show('删除章节', '此操作将删除该章节的内容，不可恢复，确定删除吗?');
        },
        onDelChapterOk() {
            const delChapterID = this.delChapterID;
            const url = `/handbooks/chapters/${delChapterID}`;
            myHTTP.delete(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    for (let i = 0; i < this.chapters.length; i++) {
                        if (this.chapters[i].id === delChapterID) {
                            if (this.curChapter && this.curChapter.id === delChapterID) {
                                this.curChapter = this.chapters[i + 1];
                            }
                            this.chapters.splice(i, 1);
                            delete this.chapterMap[delChapterID];
                            break;
                        }
                    }
                    if (!this.curChapter) {
                        this.isIntroduceSelected = true;
                    }
                }
            }).catch((err) => {
            });
        },
        onDelChapterCancel() {

        },
        onMoreToggle(index) {
            this.moreToggled[index].toggled = !this.moreToggled[index].toggled;
        },
        onClickOutsideMoreMenu(event, dataset) {
            this.moreToggled[dataset.index].toggled = false;
        },
        onChapterTitleCancel() {

        },
        onUpdateChapterTryRead(chapter, i) {
            const url = `/handbooks/chapters/${chapter.id}/tryread`;
            this.isLoading = true;
            myHTTP.put(url, { tryRead: !chapter.tryRead }).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    chapter.tryRead = res.data.data.tryRead;
                }
                this.isLoading = false;
                this.moreToggled[i].toggled = false;
            }).catch((err) => {
                console.log(err);
                this.isLoading = false;
                this.moreToggled[i].toggled = false;
            });
        }
    },
    watch: {
        curChapter(newVal, oldVal) {
            if (newVal === oldVal) {
                return;
            }
            // newVal为空，说明点击的是小册介绍
            if (!newVal) {
                this.$refs.mdEditor.setContent(this.handbook.introduce);
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
        Alert,
    }
}
</script>
