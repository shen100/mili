<template>
    <div class="article-list-item" :style="{'min-height': articleData.coverURL ? '145px' : '0'}">
        <Alert ref="delAlert" width="450" 
            @ok="onDeleteAlertOk" @cancel="onDeleteAlertCancel" />
        <div class="article-content">
            <div class="article-content-and-img">
                <div class="article-title-summary">
                    <a :href="`/p/${articleData.id}`" target="_blank" class="article-title" v-html="articleData.name"></a>
                    <p class="article-content" v-html="articleData.summary"></p>
                </div>
                <a v-if="articleData.coverURL" :href="`/p/${articleData.id}`" target="_blank" class="article-img">
                    <img :src="articleData.coverURL" />
                </a>
            </div>

            <div class="article-meta">
                <div class="article-view-like">
                    <a target="_blank" :href="`/p/${articleData.id}`"><i class="iconfont ic-list-read"></i> {{articleData.browseCount || 0}}</a>
                    <a v-if="articleData.user && articleData.user.username" :href="`/uc/${articleData.user.id}`" target="_blank" class="article-username">{{articleData.user.username}}</a>
                    <a target="_blank" :href="`/p/${articleData.id}#comments`">
                        <i class="iconfont ic-list-comments"></i>
                        {{articleData.commentCount || 0}}
                    </a>
                    <a href="javascript:void(0)" style="color: #b4b4b4; cursor: default;">
                        <img src="../../../images/article/zan.svg" style="width: 12px;" /> {{articleData.likedCount || 0}}
                    </a>
                    <span class="time">{{articleData.createdAtLabel}}</span>
                </div>
                <div v-if="moreBtnVisible" class="more-btn-box" v-clickoutside="onOutsideMore">
                    <div @click="onClickMore" class="more-button">
                        <More />
                    </div>
                    <transition name="custom-classes-transition"
                            enter-active-class="animated fadeIn faster"
                            leave-active-class="animated fadeOut faster">
                        <div v-if="morePopupVisible" class="dropdown1">
                            <div class="dropdown-caret"></div>
                            <ul class="dropdown-menu1">
                                <li><a :href="`/editor/posts/${articleData.id}`">编辑</a></li>
                                <li @click="onDelete">删除</li>
                            </ul>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { replaceIgnoreCase } from '~/js/utils/utils.js';
import { ErrorCode } from '~/js/constants/error.js';
import Alert from '~/js/components/common/Alert.vue';
import More from '~/js/components/common/More.vue';

export default {
    props: [
        'keyword',
        'article',
        'moreBtnVisible'
    ],
    data () {
        const strongHTML = `<em style="color: #e8001c">${this.keyword}</em>`;
        const articleData = {
            ...this.article,
        };
        if (this.keyword) {
            articleData.name = replaceIgnoreCase(articleData.name, this.keyword, strongHTML);
            articleData.summary = replaceIgnoreCase(articleData.summary, this.keyword, strongHTML) + '...';
        }
        return {
            articleData,
            morePopupVisible: false,
        };
    },
    methods: {
        onOutsideMore() {
            this.morePopupVisible = false;
        },
        onClickMore() {
            this.morePopupVisible = !this.morePopupVisible;
        },
        onDelete() {
            this.$refs.delAlert.show('提示', '删除文章会扣除相应的米粒值，且文章不可恢复。');
        },
        onDeleteAlertOk() {
            myHTTP.delete(`/articles/${this.articleData.id}`).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.$emit('delete', this.articleData.id);
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        onDeleteAlertCancel() {

        }
    },
    components: {
        Alert,
        More,
    }
}
</script>

<style scoped>
.article-title {
    margin-top: 0;
}

.article-list-item {
    padding: 20px;
    margin-bottom: 0;
    box-sizing: border-box;
}

.article-list-item:hover {
    background-color: rgba(222, 222, 222, 0.1);
}

.article-content-and-img {
    display: flex;
    margin-bottom: 8px;
}

.article-title-summary {
    flex: 1;
}

.article-meta {
    display: flex;
}

.article-view-like {
    flex: 1;
}

.article-content {
    margin-bottom: 0;
}

.more-btn-box {
    position: relative;
}

.more-button {
    line-height: normal;
    font-size: 0;
    cursor: pointer;
}

.dropdown1 {
    position: absolute;
    margin-top: 6px;
    z-index: 1;
    left: -39px;
}

.dropdown-menu1 {
    display: block;
    padding: 6px 0;
    border-radius: 3px;
    background-color: #fff;
    border: 1px solid #ebebeb;
    box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.06);
}

.dropdown-menu1 li {
    padding: 6px 0;
    display: block;
    font-size: 13px;
    color: #848790;
    width: 82px;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
}

.dropdown-caret, .dropdown-caret:after {
    position: absolute;
    top: -11px;
    left: 0;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-bottom-color: #ebebeb;
}

.dropdown-caret {
    left: 36px;
}

.dropdown-caret:after {
    content: "";
    top: -5px;
    left: -6px;
    border-bottom-color: #fff;
}

.dropdown-menu1 li:hover {
    color: #64686e;
    background-color: #f8f8f8;
}

.dropdown-menu1 a {
    margin-right: 0;
    color: #848790;
}

.dropdown-menu1 li:hover a {
    color: #64686e;
}
</style>
