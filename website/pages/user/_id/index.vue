<template>
    <div class="articles-container">
        <div class="article-top">
            <h1>我的文章</h1>
        </div>
        <template v-if="articles.length > 0">
            <div v-for="(article, index) in articles" class="articles-item" :class="{'articles-item-no': index === 0}">
                <h1 class="articles-title">{{article.name}}</h1>
                <p class="articles-user-info">
                    <img :src="user.avatarURL" alt="">
                    <span>{{user.name}}</span>
                </p>
                <div class="golang123-editor" :class="article.show ? '' : 'articles-hidden'" v-html="article.content"></div>
                <p class="articles-button">
                    <a :href="`/topic/${article.id}`" class="no-underline">阅读全文<Icon type="chevron-right"></Icon></a>
                </p>
            </div>
        </template>
        <div v-else class="articles-item-empty">
            还没有文章
        </div>
    </div>
</template>

<script>
    import request from '~/net/request'

    export default {
        data () {

        },
        asyncData (context) {
            return request.getUserArticles({
                client: context.req,
                params: {
                    userID: context.user.id
                },
                query: {
                    orderType: 1,
                    desc: 1,
                    pageSize: 20
                }
            }).then(res => {
                return {
                    articles: res.data.articles || [],
                    user: context.user
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        }
    }
</script>