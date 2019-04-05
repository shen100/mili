<template>
    <div class="v-tooltip-avatar">
        <div class="v-tooltip">
            <div class="tips-card">
                <div class="card-content">
                <div class="summary">
                    <a target="_blank" href="/u/21cccd3b44bf" class="avatar"
                        style="background-image: url(&quot;//upload.jianshu.io/users/upload_avatars/15050995/93415bda-578d-4ee0-83bd-4f7ceaf26c27.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/144/h/144/format/webp&quot;);"></a>
                    <div class="name">
                        <a target="_blank" :href="`/u/${user.id}.html`" class="nickname">{{user.username}}</a>
                    </div>
                    <div class="intro">{{user.signature}}</div>
                    <div class="list">
                        <a :key="article.id" v-for="article in articles" target="_blank" :href="`/p/${article.id}.html`" class="item">
                            <i class="iconfont ic-article-s"></i> 实用又方便的那种网站推荐！
                        </a>
                    </div>
                </div>
                </div>
                <div class="card-footer">
                    <div class="profile">
                        <div>
                            <span class="count">4</span>
                            <span class="type">文章</span>
                        </div>
                        <div>
                            <span class="count">5</span>
                            <span class="type">关注</span>
                        </div>
                        <div >
                        <span class="count">5</span>
                        <span class="type">粉丝</span>
                        </div>
                    </div>
                    <div class="social">
                        <a target="_blank" href="/notifications#/chats/new?mail_to=15050995"
                            class="message">发简信</a>
                        <button class="off user-follow-button">
                            <i class="iconfont"></i>
                            <span >关注</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.v-tooltip-avatar {
    position: absolute;
}
</style>

