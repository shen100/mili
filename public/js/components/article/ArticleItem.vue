<template>
    <div class="article-list-item">
        <div class="article-content" :style="{'padding-right': articleData.image ? '140px' : '0' }">
            <a :href="`/p/${articleData.id}.html`" target="_blank" class="article-title" v-html="articleData.name"></a>
            <p class="article-content">{{articleData.summary}}...</p>
            <div class="article-meta">
                <span class="paid-meta"><i class="iconfont ic-paid"></i> 付费</span>
                <a target="_blank" :href="`/p/${articleData.id}.html`"><i class="iconfont ic-list-read"></i> {{articleData.browseCount || 0}}</a>
                <a v-if="articleData.user && articleData.user.username" :href="`/users/${articleData.user.id}.html`" target="_blank" class="article-username">{{articleData.user.username}}</a>
                <a target="_blank" :href="`/p/${articleData.id}.html#comments`">
                    <i class="iconfont ic-list-comments"></i>
                    {{articleData.commentCount || 0}}
                </a>
                <a target="_blank" :href="`/p/${articleData.id}.html`">
                    <i class="iconfont ic-list-like"></i> {{articleData.likeCount || 0}}
                </a>
                <span class="time">{{articleData.createdAtLabel}}</span>
            </div>
        </div>
        <a v-if="articleData.image" :href="`/p/${articleData.id}.html`" target="_blank" class="article-img">
            <img :src="articleData.image" />
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
            articleData.summary = replaceIgnoreCase(articleData.summary, this.keyword, strongHTML);
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


