<template>
    <div id="app">
        <ErrorTip ref="errorTip" />
        <Modal v-model="includedModelVisible" class-name="vertical-center-modal" width="560" :closable="false" footer-hide>
            <div slot="header" class="included-modal-header">
                <button @click="onCloseCollectionModel" type="button" class="close">×</button> 
                <h4 class="included-modal-title">收录文章到该专题
                    <a href="/writer#" class="new-note-btn">写篇新文章</a>
                </h4> 
                <span class="notice">每篇文章有总共有5次投稿机会</span> 
                <div>
                    <input type="text" v-model="keyword" @keyup.enter="reqMyArticles" placeholder="搜索我的文章" class="search-input"> 
                    <a class="search-btn" @click="reqMyArticles"><i class="iconfont ic-search"></i></a>
                </div>
            </div>
            <div class="included-modal-body">
                <ul id="contribute-note-list">
                    <li :key="article.id" v-for="article in articles">
                        <div>
                            <div class="note-name">{{article.name}}</div> 
                            <span v-if="article.collectionStatus === ArticleCollectionStatus.Collected" class="status has-add">已加入</span>
                            <span v-if="article.collectionStatus === ArticleCollectionStatus.Auditing" class="status has-add">待审核</span>
                            <a v-if="article.collectionStatus === ArticleCollectionStatus.Collected" @click="onRemoveArticle(article)" class="action-btn remove">移除</a>
                            <a v-else-if="article.collectionStatus === ArticleCollectionStatus.Auditing" @click="onRemoveArticle(article)" class="action-btn remove">撤回</a>
                            <a v-else :id="article.id" @click="onCollectArticle(article)" class="action-btn push">{{isCollectionAdmin ? '收录' : '投稿'}}</a>
                        </div>
                    </li>
                </ul>
                <div v-if="isLoading" class="modal-notes-placeholder">
                    <div class="text"></div> 
                    <div class="btn"></div>
                </div>
                <div v-else-if="!articles.length" class="default">未找到相关文章</div>
            </div>
        </Modal>
        <Modal v-model="deleteModelVisible" class-name="vertical-center-modal" width="460" :closable="false" footer-hide>
            <div slot="header" class="delete-modal-header">
                <h4>删除专题</h4>
            </div>
            <div class="delete-modal-body">
                <p>该专题目前收录了{{articleCount}}篇文章，删除专题操作不可逆，请慎重！</p> 
                <input v-model="inputTitle" @keyup.enter="onDeleteCollection" type="text" placeholder="确认删除请输入专题名称">
            </div>
            <div class="delete-modal-footer">
                <button @click="onDeleteCollection" class="submit">确认</button> 
                <button @click="onCloseDeleteModel"  class="cancel">取消</button>
            </div>
        </Modal>
    </div>
</template>

<style>
    .included-modal-header {
        padding: 20px;
        border-bottom: 1px solid #e5e5e5;
    }

    .included-modal-header .close {
        margin-top: -2px;
    }

    .included-modal-title {
        margin: 0;
        line-height: 1.42857;
        font-size: 17px;
        font-weight: 700;
        color: #333;
        margin-bottom: 4px;
    }

    .included-modal-header .new-note-btn {
        padding-left: 10px;
        font-size: 13px;
        font-weight: 400;
        color: #42c02e;
        vertical-align: middle;
    }

    .included-modal-header .close {
        font-family: -apple-system,SF UI Text,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif;
        float: right;
        line-height: 1;
        color: #000;
        opacity: .2;
        filter: alpha(opacity=20);
        font-weight: 200;
        font-size: 26px;
        outline: none;
        text-shadow: none;
        padding: 0;
        cursor: pointer;
        background: transparent;
        border: 0;
        -webkit-appearance: none;
    }

    .included-modal-header .close:focus, .included-modal-header .close:hover {
        color: #000;
        text-decoration: none;
        cursor: pointer;
        opacity: .5;
        filter: alpha(opacity=50);
    }

    .ivu-modal-mask {
        background-color: hsla(0, 0%, 100%, .7);
    }

    .ivu-modal-header {
        padding: 0;
        border-bottom: none;
    }

    .ivu-modal-body {
        padding: 0;
    }

    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .vertical-center-modal .ivu-modal {
        top: 0;
    }

    .ivu-modal-content {
        box-shadow: 0 5px 25px rgba(0,0,0,.1);
        border: 1px solid rgba(0,0,0,.1);
    }
</style>

<script>
import { ArticleCollectionStatus } from '~/js/constants/entity.js';
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import { trim } from '~/js/utils/utils.js';
import ErrorTip from '~/js/components/common/ErrorTip.vue';

export default {
    name: 'App',
    data: function() {
        return {
            includedModelVisible: false,
            deleteModelVisible: false,
            collectionID: window.collectionID,
            creatorID: window.creatorID,
            collectionTitle: window.collectionTitle,
            articleCount: window.articleCount, // 专题下已收录的文章数
            articles: [],
            isLoading: true,
            isCollectionAdmin: window.isCollectionAdmin,
            ArticleCollectionStatus: ArticleCollectionStatus,
            keyword: '',
            inputTitle: ''
        };
    },
    mounted: function() {
        const self = this;
        this.$nextTick(function() {
            $('#includedBtn').click(function() {
                self.includedModelVisible = true;
            });
            $('#postToCollection').click(function() {
                self.includedModelVisible = true;
            });
            $('#deleteCollectionBtn').click(function() {
                self.deleteModelVisible = true;
            });
        });
        this.reqMyArticles();
    },
    methods: {
        reqMyArticles() {
            this.articles = [];
            let keyword = this.keyword || '';
            if (keyword) {
                keyword = encodeURIComponent(keyword);
            }
            const url = `/collections/${this.collectionID}/myarticles?q=${keyword}`;
            myHTTP.get(url).then((res) => {
                this.articles = res.data.data;
            });
        },
        onCollectArticle(article) {
            const url = `/collections/${this.collectionID}/articles/${article.id}`;
            myHTTP.post(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    if (this.isCollectionAdmin) {
                        article.collectionStatus = ArticleCollectionStatus.Collected;
                    } else {
                        article.collectionStatus = ArticleCollectionStatus.Auditing;
                    }
                }
            });
        },
        onRemoveArticle(article) {
            const url = `/collections/${this.collectionID}/articles/${article.id}`;
            myHTTP.delete(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    article.collectionStatus = ArticleCollectionStatus.NotCollect;
                }
            });
        },
        onCloseCollectionModel() {
            this.includedModelVisible = false;
        },
        onCloseDeleteModel() {
            this.deleteModelVisible = false;
        },
        onDeleteCollection() {
            let inputTitle = trim(this.inputTitle);
            if (inputTitle !== collectionTitle) {
                this.$refs.errorTip.show('专题名称错误');
                return;
            }
            const url = `/collections/${this.collectionID}`;
            myHTTP.delete(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    location.href = `/u/${this.creatorID}.html`;
                }
            });
        }
    },
    components: {
        ErrorTip,
    }
};
</script>
