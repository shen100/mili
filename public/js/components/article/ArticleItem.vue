<template>
    <div>
        <div class="article-content" :style="{'padding-right': article.image ? '140px' : '0' }">
            <a :href="`/p/${article.id}.html`" class="article-title">{{article.name}}</a>
            <p class="article-content">{{article.summary}}...</p>
            <div class="article-meta">
                <span class="paid-meta"><i class="iconfont ic-paid"></i> 付费</span>
                <a target="_blank" :href="`/p/${article.id}.html`"><i class="iconfont ic-list-read"></i> {{article.browseCount}}</a>
                <a v-if="article.user && article.user.username" class="article-username">{{article.user.username}}</a>
                <a target="_blank" :href="`/p/${article.id}.html`">
                    <i class="iconfont ic-list-comments"></i>
                    {{article.commentCount || 0}}
                </a>
                <span><i class="iconfont ic-list-like"></i> {{article.likeCount || 0}}</span>
                <span class="time">{{article.createdAt | recentTime('YYYY.MM.DD HH:mm')}}</span>
            </div>
        </div>
        <a v-if="result.image" class="article-img">
            <img :src="article.image" />
        </a>
    </div>
</template>

<script>
export default {
    props: [
        'article'
    ],
}
</script>

