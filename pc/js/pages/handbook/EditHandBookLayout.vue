<template>
    <div id="app">
        <Alert ref="delChapterAlert" width="450" 
            @ok="onDelChapterOk" @cancel="onDelChapterCancel" />
        <AddChapterAlert ref="chapterTitleAlert" width="450" @ok="onChapterTitleOk" @cancel="onChapterTitleCancel" />
        <div id="editorBox">
            <HandbookHeader v-show="!isLoading" :siteName="siteName"
                :userID="userID" :avatarURL="avatarURL"
                :isContentSaved="isContentSaved" />
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
                                    <!-- <div class="bar"><img src="../../../images/handbook/dir.svg"></div> -->
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
                    <MarkdownEditor
                        ref="mdEditor"
                        :content="initialContent" />
                </div>
            </div>
        </div>
        <GlobalLoading v-if="isLoading" />
        <div>
            <router-view></router-view>
        </div>
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
        const moreToggled = [];
        return {
            userID: window.userID,
            avatarURL: window.avatarURL,
            siteName: window.siteName,
            handbook: null,
            isIntroduceSelected: true,
            chapters: [],
            initialContent: '',
            moreToggled,
            curChapter: window.chapter || null,
            delChapterID: 0,
            isLoading: false,
        };
    },
    methods: {
        requestHandbook() {

        },
        requestChapters() {
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
        },
        requestChapterDetail() {
            this.initialContent = window.chapter && window.chapter.content || handbook.introduce;
        },
        getEditorMarkdown() {
            return this.$refs.mdEditor.getContent();
        },
        isContentSaved(callback) {
            const content = this.getEditorMarkdown();
            if (this.isIntroduceSelected) {
                if (this.handbook.introduce === content) {
                    return callback(true);
                }
                const putIntroduceURL = `/handbooks/${this.handbook.id}/introduce`;
                const reqData = {
                    introduce: content,
                };
                myHTTP.put(putIntroduceURL, reqData).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        return callback(true);
                    }
                    return callback(false);
                }).catch(err => {
                    return callback(false);
                });
                return;
            }

            if (this.curChapter.content === content) {
                return callback(true);
            }
            const putChapterURL = `/handbooks/chapters/${this.curChapter.id}/content`;
            const reqData = {
                content,
            };

            myHTTP.put(putChapterURL, reqData).then(res => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    return callback(true);
                }
                return callback(false);
            }).catch(err => {
                return callback(false);
            });
        },
        onIntroduceClick() {
            const content = this.getEditorMarkdown();
            // this.curChapter 为空，是小册介绍切到小册介绍, 直接返回
            if (!this.curChapter) {
                return;
            }
            // this.curChapter 不为空，是由章节切到小册介绍
            if (this.curChapter.content === content) {
                this.curChapter = null;
                this.isIntroduceSelected = true;
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
                    this.isIntroduceSelected = true;
                }
                this.isLoading = false;
            }).catch((err) => {
                this.isLoading = false;
            });
        },

        onChapterClick(chapter) {
            const content = this.getEditorMarkdown();
            // 由小册介绍切到章节
            if (this.isIntroduceSelected) {
                const putIntroduceURL = `/handbooks/${this.handbook.id}/introduce`;
                const getChapterURL = `/handbooks/chapters/${chapter.id}`;
                const reqData = {
                    introduce: content,
                };

                this.isLoading = true;

                Promise.all([
                    content !== this.handbook.introduce ? myHTTP.put(putIntroduceURL, reqData) : Promise.resolve(true),
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
                        this.isIntroduceSelected = false;
                        this.handbook.introduce = content;
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
                    this.isIntroduceSelected = false;
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
            if (this.isIntroduceSelected) {
                if (content === this.handbook.introduce) {
                    this.$refs.chapterTitleAlert.show(this.chapters.length + 1, '', undefined);
                    return;
                }
                const putIntroduceURL = `/handbooks/${this.handbook.id}/introduce`;
                const reqData = {
                    introduce: content,
                };
                this.isLoading = true;
                myHTTP.put(putIntroduceURL, reqData).then((res) => {
                    if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                        this.handbook.introduce = content;
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
        onDeleteChapter(id) {
            this.delChapterID = id;
            this.$refs.delChapterAlert.show('删除章节', '此操作将删除该章节的内容，不可恢复，确定删除吗?');
        },
        onDelChapterOk() {
            const delChapterID = this.delChapterID;
            const url = `/handbooks/chapters/${delChapterID}`;
            this.isDraftSaving = true;
            myHTTP.delete(url).then((res) => {
                this.isDraftSaving = false;
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    for (let i = 0; i < this.chapters.length; i++) {
                        if (this.chapters[i].id === delChapterID) {
                            this.chapters.splice(i, 1);
                            break;
                        }
                    }
                }
            }).catch((err) => {
                this.isDraftSaving = false;
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
                    this.isIntroduceSelected = false;
                }
                this.isLoading = false;
            }).catch((err) => {
                this.isLoading = false;
            });
        },
        onChapterTitleCancel() {

        },
        onUpdateChapterTryRead(chapter, i) {
            const url = `/handbooks/chapters/${chapter.id}/tryread`;
            const reqData = {
                tryRead: !chapter.tryRead,
            };
            this.isLoading = true;
            myHTTP.put(url, reqData).then((res) => {
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
    mounted () {
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
