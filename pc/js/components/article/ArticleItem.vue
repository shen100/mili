<template>
    <div class="article-list-item" :style="{'min-height': articleData.coverURL ? '145px' : '0'}">
        <div class="article-content" :style="{'padding-right': articleData.coverURL ? '140px' : '0' }">
            <a :href="`/p/${articleData.id}`" target="_blank" class="article-title" v-html="articleData.name"></a>
            <p class="article-content" v-html="articleData.summary"></p>
            <div class="article-meta">
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
        </div>
        <a v-if="articleData.coverURL" :href="`/p/${articleData.id}`" target="_blank" class="article-img">
            <img :src="articleData.coverURL" />
        </a>
    </div>
</template>

<script>
import { replaceIgnoreCase } from '~/js/utils/utils.js';

export default {
    props: [
        'keyword',
        'article'
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
        };
    },
}
</script>

<style scoped>
.article-list-item {
    padding: 20px;
    margin-bottom: 0;
    box-sizing: border-box;
}

.article-list-item:hover {
    background-color: rgba(222, 222, 222, 0.1);
}
</style>
