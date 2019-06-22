<template>
    <div>
        <SuccessTip ref="successTip" :width="200" />
        <ArticleShareQRCode ref="qrCodePopup" :articleID="article.id"/>
        <div class="done-header">
            <div class="done-title">
                <a :href="`/p/${article.id}.html`" class="main-title">{{article.name}}</a><br>
                <a :href="`/p/${article.id}.html`" class="sub-title">发布成功，点击查看文章</a>
            </div>
            <ul class="article-share">
                <li class="weibo">
                    <a :href="`${shareURL}&platform=weibo`" target="_blank"><i class="fa fa-weibo"></i>微博</a>
                </li>
                <li @click="showQRCodePopup" class="weixin"><i class="fa fa-wechat"></i>微信</li>
                <li class="link" :data-clipboard-text="`${url}/p/${article.id}.html`" @click="onCopyLink"><i class="fa fa-link"></i>复制链接</li>
                <li @mouseleave="onMoreShareMouseLeave" @mouseenter="onMoreShareMouseEnter" class="more">
                    <span class="more">更多分享
                        <div v-if="sharePopupVisible" class="popup">
                            <ul>
                                <li @click="showQRCodePopup" style="padding: 4px 12px;">
                                    <span class="social-item"><i class="social-icon-weixin"></i><span class="social-title">微信</span></span>
                                </li>
                                <li>
                                    <a :href="`${shareURL}&platform=qzone`" target="_blank">
                                        <span class="social-item"><i class="social-icon-zone"></i><span class="social-title">QQ空间</span></span>
                                    </a>
                                </li>
                                <li>
                                    <a :href="`${shareURL}&platform=douban`" target="_blank">
                                        <span class="social-item"><i class="social-icon-douban"></i><span class="social-title">豆瓣</span></span>
                                    </a>
                                </li>
                                <li>
                                    <a :href="`${shareURL}&platform=facebook`" target="_blank">
                                        <span class="social-item"><i class="social-icon-facebook"></i><span class="social-title">Facebook</span></span>
                                    </a>
                                </li>
                                <li>
                                    <a :href="`${shareURL}&platform=twitter`" target="_blank">
                                        <span class="social-item"><i class="social-icon-twitter"></i><span class="social-title">Twitter</span></span>
                                    </a>
                                </li>
                                <li>
                                    <a :href="`${shareURL}&platform=google`" target="_blank">
                                        <span class="social-item"><i class="social-icon-google"></i><span class="social-title">Google+</span></span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </span>
                </li>
            </ul>
        </div>
        <div class="done-header-sep"></div>
        <div class="done-box">
            <div class="done-search">
                <div class="done-search-input">
                    <i class="fa fa-search fa-2x"></i>
                    <input v-model="searchCollectionName" @input="onSearchInput" @keyup.enter="onSearchCollection" type="text" placeholder="搜索专题">
                </div>
                <div class="done-search-label">向专题投稿，让文章被更多人发现</div>
            </div>
            <div v-if="isSearch">
                <div class="search-collection-box">
                    <div v-if="isSearchLoading" class="loading-collection-box">
                        <div class="loading-rect">
                            <svg class="loading-collection" viewBox="25 25 50 50">
                                <circle class="loading-collection-circle" cx="50" cy="50" r="20" fill="none"></circle>
                            </svg>
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="searchCollections && searchCollections.length" class="collection-box">
                            <ul class="collection-list" style="border-top: 1px solid #f2f2f2;">
                                <li :key="c.id" v-for="c in searchCollections" class="collection-item" style="width: 50%;">
                                    <img @click="jumpToCollection(c.id)" :src="c.coverURL" />
                                    <a :style="{cursor: c.buttonMode ? 'pointer' : 'default'}" @click="onContribute(c)">{{c.statusLabel}}</a>
                                    <span :title="c.name" class="recommend-name"><span @click="jumpToCollection(c.id)">{{c.name}}</span><em>{{c.articleCount | countToK}}篇文章，{{c.followerCount | countToK}}人关注</em></span>
                                </li>
                            </ul>
                        </div>
                        <div v-else class="no-search-result">暂无数据</div>
                    </div>
                </div>
            </div>
            <template v-else>
                <div class="collection-box my-collection-box">
                    <h3 class="collection-box-title my-collection-box-title">
                        创建/管理的专题<a class="my-collection-box-new" href="/collections/new">新建</a>
                    </h3>
                    <ul class="collection-list">
                        <li :key="c.id" v-for="c in collections" class="collection-item">
                            <span :title="c.name" class="my-collection-name">
                                <span @click="jumpToCollection(c.id)" style="cursor: pointer;">{{c.name}}</span>
                            </span>
                            <img @click="jumpToCollection(c.id)" :src="c.coverURL" />
                            <a :style="{cursor: c.buttonMode ? 'pointer' : 'default'}" @click="onContribute(c, true)">{{c.statusLabel}}</a>
                        </li>
                    </ul>
                </div>
                <div class="collection-box my-collection-box">
                    <h3 class="collection-box-title my-collection-box-title">
                        最近投稿
                    </h3>
                    <ul class="collection-list">
                        <li :key="c.id" v-for="c in contributeCollections" class="collection-item">
                            <span :title="c.name" class="my-collection-name">
                                <span @click="jumpToCollection(c.id)" style="cursor: pointer;">{{c.name}}</span>
                            </span>
                            <img @click="jumpToCollection(c.id)" :src="c.coverURL" />
                            <a :style="{cursor: c.buttonMode ? 'pointer' : 'default'}" @click="onContribute(c)">{{c.statusLabel}}</a>
                        </li>
                    </ul>
                </div>
                <div class="collection-box" style="margin-bottom: 30px;">
                    <h3 class="collection-box-title">推荐专题</h3>
                    <ul class="collection-list">
                        <li :key="c.id" v-for="c in recommendCollections" class="collection-item" style="width: 50%;">
                            <img @click="jumpToCollection(c.id)" :src="c.coverURL" />
                            <a :style="{cursor: c.buttonMode ? 'pointer' : 'default'}" @click="onContribute(c)">{{c.statusLabel}}</a>
                            <span :title="c.name" class="recommend-name"><span @click="jumpToCollection(c.id)">{{c.name}}</span><em>{{c.articleCount | countToK}}篇文章，{{c.followerCount | countToK}}人关注</em></span>
                        </li>
                    </ul>
                </div>
                <div class="no-more">没有更多了 </div>
            </template>
        </div>
    </div>
</template>

<script>
import ClipboardJS from 'clipboard';
import { ArticleCollectionStatus } from '~/js/constants/entity.js';
import { trim, countToK } from '~/js/utils/utils.js';
import { myHTTP } from '~/js/common/net.js';
import SuccessTip from '~/js/components/common/SuccessTip.vue';
import ArticleShareQRCode from '~/js/components/article/ArticleShareQRCode.vue';
import { ErrorCode } from '~/js/constants/error.js';

export default {
    data () {
        const collections = window.collections; // 创建/管理的专题
        const contributeCollections = window.contributeCollections; // 最近投稿的专题
        const recommendCollections = window.recommendCollections; // 推荐专题
        collections.forEach(c => {
            c.statusLabel = '收录';
            c.buttonMode = true;
        });
        contributeCollections.forEach(c => {
            c.statusLabel = '投稿';
            c.buttonMode = true;
        });
        recommendCollections.forEach(c => {
            c.statusLabel = '投稿';
            c.buttonMode = true;
        });
        let url = `${window.globalConfig.apiPrefix}`;
        const article = window.article;
        const title = article.name;
        const summary = article.summary;
        const coverURL = article.coverURL || '';

        const shareURL = `${url}/share?title=${title}&content=${summary}&imgurl=${coverURL}`;
        return {
            url: window.globalConfig.url,
            article: article,
            sharePopupVisible: false,
            shareURL: shareURL,
            collections: collections, // 创建/管理的专题
            contributeCollections: contributeCollections, // 最近投稿的专题
            recommendCollections: recommendCollections, // 推荐专题
            // isSearch为true时，显示搜索的专题，否则显示创建/管理的专题、最近投稿的专题、推荐专题
            isSearch: false,
            isSearchLoading: false, // 是否正在搜索专题
            searchCollectionName: '',
            searchCollections: [],
            collectionIDs: [], // 用户刚刚操作后，投稿的专题
        };
    },
    mounted() {
        this.$nextTick(() => {
            new ClipboardJS('.link');
        });
    },
    methods: {
        showQRCodePopup() {
            this.$refs.qrCodePopup.show();
        },
        onMoreShareMouseLeave() {
            this.sharePopupVisible = false;
        },
        onMoreShareMouseEnter() {
            this.sharePopupVisible = true;
        },
        onCopyLink() {
            this.$refs.successTip.show('已复制到剪贴板中');
        },
        updateCollectionStatus(c) {
            function updateStatus(collectionArr) {
                if (!collectionArr || collectionArr.length <= 0) {
                    return;
                }
                collectionArr.forEach(collection => {
                    if (collection.id === c.id) {
                        collection.statusLabel = '等待审核';
                        collection.buttonMode = false;
                    }
                });
            }
            updateStatus(this.collections);
            updateStatus(this.contributeCollections);
            updateStatus(this.recommendCollections);
            updateStatus(this.searchCollections);
        },
        onContribute(collection, isManager) {
            if (!collection.buttonMode) {
                return;
            }
            collection.statusLabel = isManager ? '收录中' : '投稿中';
            collection.buttonMode = false;
            const url = `/collections/${collection.id}/articles/${article.id}`;
            myHTTP.post(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    if (res.data.data.status === ArticleCollectionStatus.Collected) {
                        collection.statusLabel = '已收录';
                        collection.buttonMode = false;
                    } else if (res.data.data.status === ArticleCollectionStatus.Auditing) {
                        if (!isManager) {
                            this.collectionIDs.push(collection.id);
                        }
                        this.updateCollectionStatus(collection);
                    }
                } else {
                    collection.statusLabel = isManager ? '收录' : '投稿';
                    collection.buttonMode = true;
                }
            }).catch((err) => {
                collection.statusLabel = isManager ? '收录' : '投稿';
                collection.buttonMode = true;
            });
        },
        jumpToCollection(id) {
            location.href = `/collections/${id}.html`;
        },
        onSearchInput(event) {
            let name = this.searchCollectionName;
            name = trim(name);
            if (!name) {
                this.isSearch = false;
                this.isSearchLoading = false;
            }
        },
        onSearchCollection() {
            const url = `/collections/searchbypublish`;
            let name = this.searchCollectionName;
            name = trim(name);
            if (!name) {
                this.isSearch = false;
                this.isSearchLoading = false;
                return;
            }
            this.isSearch = true;
            this.isSearchLoading = true;
            myHTTP.get(url).then((res) => {
                this.isSearchLoading = false;
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    const searchCollections = res.data.data;
                    searchCollections.forEach(c => {
                        if (this.collectionIDs.indexOf(c.id) >= 0) {
                            c.statusLabel = '等待审核';
                            c.buttonMode = false;
                        } else {
                            c.statusLabel = '投稿';
                            c.buttonMode = true;
                        }
                    });
                    this.searchCollections = searchCollections;
                } else {
                    this.$refs.successTip.show(res.data.message);
                }
            }).catch((err) => {
                this.isSearchLoading = false;
            });
        }
    },
    filters: {
        countToK,
    },
    components: {
        ArticleShareQRCode,
        SuccessTip,
    }
}
</script>

<style lang="scss" scoped>
    .done-close {
        position: fixed;
        top: 50px;
        right: 100px;
        font-size: 30px;
        font-weight: 700;
        padding: 5px;
        cursor: pointer;
    }

    .done-header {
        background-color: #f2f2f2;
        padding-bottom: 110px;
    }

    .done-title {
        padding: 80px 0 40px;
        padding-top: 115px;
        text-align: center;
    }

    .done-title .main-title {
        display: inline-block;
        height: 40px;
        font-size: 28px;
        font-weight: 500;
        color: #333;
        margin-bottom: 24px;
    }

    .done-title .sub-title {
        font-size: 16px;
        font-weight: 600;
        color: #42c02e;
        text-decoration: none;
    }

    .done-title .sub-title:hover {
        color: #3bab29;
    }

    .done-title .sub-title:before {
        content: "";
        display: inline-block;
        width: 18px;
        height: 10px;
        border: 3px solid #42c02e;
        border-width: 0 0 4px 4px;
        -webkit-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        transform: rotate(-45deg);
        -webkit-transition: 0s;
        -o-transition: 0s;
        transition: 0s;
        position: relative;
        bottom: 4px;
        right: 8px;
    }

    .article-share {
        text-align: center;
        color: #fff;
        font-size: 14px;
    }

    .article-share>li {
        display: inline-block;
        width: 124px;
        line-height: 38px;
        border-radius: 100px;
        margin: 0 15px;
        cursor: pointer;
        padding: 0;
        text-align: center;
    }

    .article-share>li a {
        display: block;
        text-decoration: none;
        color: #fff;
    }

    .article-share>li i {
        margin-right: 5px;
    }

    .article-share li.weibo {
        background-color: #e05244;
    }

    .article-share li.weixin {
        background-color: #07b225;
    }

    .article-share li.sina {
        background-color: #e05244;
    }

    .article-share li.link {
        background-color: #3194d0;
    }

    .article-share li.more {
        background-color: #a7a7a7;
        position: relative;
    }

    .article-share li.more .popup {
        position: absolute;
        height: 100%;
        top: 38px;
        right: 0;
        z-index: 1;
    }

    .article-share .popup ul {
        width: 124px;
        right: -124px;
        top: 100%;
        z-index: 2;
        font-size: 14px;
        -webkit-box-shadow: 0 5px 10px rgba(0,0,0,.2);
        box-shadow: 0 5px 10px rgba(0,0,0,.2);
        list-style: none;
        background-color: #fff;
        color: #595959;
        border-radius: 6px;
    }

    .article-share .popup ul li {
        text-align: left;
        padding: 0;
        line-height: 24px;
        overflow: hidden;
        border-bottom: 1px solid #d9d9d9;
    }

    .article-share .popup ul a {
        padding: 4px 12px;
        color: #595959;
    }

    .article-share .popup ul li:hover {
        background-color: #666;
        color: #fff;
    }

    .article-share .popup ul li:hover a {
        color: #fff;
    }

    .article-share .popup ul li:first-child {
        border-radius: 4px 4px 0 0;
    }

    .article-share .popup ul li:last-child {
        border-radius: 0 0 4px 4px;
        border-bottom: 0;
    }

    .article-share .popup ul i {
        background-image: url(../../../images/social.png);
        background-size: 240px 20px;
        display: inline-block;
        vertical-align: top;
        margin: 3px 6px 0 0;
        padding: 0;
        width: 18px;
        height: 18px;
    }

    .social-icon-weixin {
        background-position: -20px 0
    }

    .social-icon-zone {
        background-position: -60px 0
    }

    .social-icon-twitter {
        background-position: -80px 0
    }

    .social-icon-facebook {
        background-position: -100px 0
    }

    .social-icon-google {
        background-position: -120px 0
    }

    .social-icon-douban {
        background-position: -140px 0
    }

    .social-item {
        display: inline-block;
    }

    .social-title {
        display: inline-block;
    }

    .done-header-sep {
        height: 40px;
        border-radius: 50% 50% 0 0/100% 100% 0 0;
        background-color: #fff;
        margin-top: -40px;
    }

    .done-box {
        margin: 40px auto 0;
        width: 700px;
        font-size: 14px;
    }

    .done-search {
        margin-bottom: 36px;
    }

    .done-search-label {
        font-size: 16px;
        font-weight: 500;
        line-height: 38px;
    }

    .done-search-input {
        float: right;
        border: 1px solid #d9d9d9;
        position: relative;
        width: 200px;
        height: 34px;
        border-radius: 17px;
        padding: 5px 20px 5px 30px;
        box-sizing: border-box;
    }

    .done-search-input i {
        position: absolute;
        left: 10px;
        top: 50%;
        margin-top: -8px;
        font-size: 16px;
        color: #ccc;
        height: 16px;
        line-height: 16px;
    }

    .fa-search:before {
        content: "\F002";
    }

    .done-search-input input {
        border: none;
        line-height: 24px;
        height: 24px;
        width: 100%;
        font-size: 14px;
        background-color: transparent;
    }

    .collection-box {
        margin-bottom: 50px;
        overflow: hidden;
    }

    .collection-box-title {
        margin-bottom: 0;
        height: 40px;
        line-height: 40px;
        padding: 0 6px 0 14px;
        background-color: #f2f2f2;
        font-size: 14px;
    }

    .my-collection-box-new {
        margin-left: 15px;
        color: #42c02e;
        text-decoration: none;
    }

    .collection-list {
        position: relative;
        min-height: 72px;
        overflow: hidden;
        border-left: 1px solid #f2f2f2;
    }

    .collection-item {
        float: left;
        width: 233px;
        border-right: 1px solid #f2f2f2;
        border-bottom: 1px solid #f2f2f2;
        position: relative;
        margin: 0;
        list-style-type: none;
        box-sizing: border-box;
    }

    .collection-item img {
        position: absolute;
        height: 40px;
        width: 40px;
        left: 15px;
        top: 15px;
        border-radius: 10%;
        cursor: pointer;
    }

    .collection-item .my-collection-name {
        display: block;
        font-weight: 700;
        color: #595959;
        width: 100%;
        padding: 0 60px 0 75px;
        line-height: 70px;
        overflow: hidden;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
        box-sizing: border-box;
    }

    .collection-item a {
        position: absolute;
        top: 24px;
        right: 15px;
        color: #42c02e;
        text-decoration: none;
    }

    .collection-item .recommend-name {
        display: block;
        padding: 18px 65px 16px;
        line-height: 1;
    }

    .collection-item .recommend-name span {
        color: #595959;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
    }

    .collection-item .recommend-name em {
        font-weight: 400;
        font-style: normal;
        color: #999;
        display: block;
        margin-top: 8px;
        font-size: 12px;
    }

    .no-more {
        padding-bottom: 80px;
        text-align: center;
        color: rgba(0, 0, 0, 0.65);
    }

    @-webkit-keyframes oneturn {
        to {
            -webkit-transform: rotate(1turn);
            transform: rotate(1turn);
        }
    }
    
    @keyframes oneturn {
        to {
            -webkit-transform: rotate(1turn);
            transform: rotate(1turn);
        }
    }

    @-webkit-keyframes strokedash {
        0% {
            stroke-dasharray: 1, 151;
            stroke-dashoffset: 0;
        }

        50% {
            stroke-dasharray: 89, 151;
            stroke-dashoffset: -35px;
        }

        to {
            stroke-dasharray: 89, 151;
            stroke-dashoffset: -124px;
        }
    }
    
    @keyframes strokedash {
        0% {
            stroke-dasharray: 1, 151;
            stroke-dashoffset: 0;
        }

        50% {
            stroke-dasharray: 89, 151;
            stroke-dashoffset: -35px;
        }

        to {
            stroke-dasharray: 89, 151;
            stroke-dashoffset: -124px;
        }
    }

    .search-collection-box {
        position: relative;
        min-height: 200px;
    }

    .loading-collection-box {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .loading-rect {
        width: 48px;
        height: 48px;
    }

    .loading-collection {
        -webkit-animation: oneturn 2s linear infinite;
        animation: oneturn 2s linear infinite;
        height: 100%;
        -webkit-transform-origin: center center;
        -ms-transform-origin: center center;
        transform-origin: center center;
        width: 100%;
        will-change: transfrom;
    }

    .loading-collection-circle {
        stroke-width: 5;
        stroke-miterlimit: 10;
        stroke-dasharray: 1, 151;
        stroke-dashoffset: 0;
        stroke-linecap: round;
        stroke: #ec7259;
        -webkit-animation: strokedash 1.5s cubic-bezier(.645, .045, .355, 1) infinite;
        animation: strokedash 1.5s cubic-bezier(.645, .045, .355, 1) infinite;
        will-change: stroke-dasharray, stroke-dashoffset;
    }

    .no-search-result {
        text-align: center;
        padding-top: 30px;
    }
</style>

