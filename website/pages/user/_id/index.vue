<template>
    <div class="articles-container">
        <div class="article-top">
            <div>{{user && user.id == this.currentId ? '我' : (sex ? '她' : '他')}}的话题</div>
        </div>
        <template v-if="articles.length > 0">
            <div v-for="(article, index) in articles" class="articles-item" :class="{'articles-item-no': index === 0}">
                <h2 class="articles-title"><a :href="`/topic/${article.id}`" target="_blank">{{article.name}}</a></h2>
                <p class="articles-user-info">
                    <img :src="article.user.avatarURL" alt="">
                    <span>{{article.user.name}}</span>
                </p>
                <div class="golang123-editor" :class="article.show ? '' : 'articles-hidden'" v-html="article.content"></div>
                <p class="articles-button">
                    <a :href="`/topic/${article.id}`" class="no-underline">阅读全文<Icon type="chevron-right"></Icon></a>
                </p>
            </div>
        </template>
        <div v-else class="articles-item-empty">
            还没有话题
        </div>
    </div>
</template>

<script>
    import request from '~/net/request'

    export default {
        data () {
            return {
                sex: 0
            }
        },
        asyncData (context) {
            return request.getUserArticles({
                client: context.req,
                params: {
                    userID: context.params.id
                },
                query: {
                    orderType: 1,
                    desc: 1,
                    pageSize: 20
                }
            }).then(res => {
                return {
                    articles: res.data.articles || [],
                    user: context.user,
                    currentId: context.params.id
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        mounted () {
            this.$data.sex = this.$parent.currentUser.sex
        }
    }
</script>
