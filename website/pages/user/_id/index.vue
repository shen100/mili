<template>
    <div class="articles-container">
        <div class="article-top">
            <div>{{user && user.id == this.currentId ? '我' : (sex ? '她' : '他')}}的话题</div>
        </div>
        <template v-if="articles.length > 0">
            <div v-for="(article, index) in articles" class="articles-item" :class="{'articles-item-no': index === 0}">
                <h2 class="articles-title"><a :href="`/topic/${article.id}`" target="_blank">{{article.name}}</a></h2>
                <p class="articles-user-info">
                    <img class="articles-user-info-img" :src="article.user.avatarURL" alt="">
                    <a class="articles-user-info-name">{{article.user.name}}</a>
                </p>
                <div class="golang123-digest" v-html="article.htmlContent"></div>
            </div>
            <div style="text-align: center;">
                <Page class="common-page"
                    :current="pageNo"
                    :page-size="pageSize"
                    :total="totalCount"
                    @on-change="onPageChange"
                    :show-elevator="true"/>
            </div>
        </template>
        <div v-else class="articles-item-empty">
            还没有话题
        </div>
    </div>
</template>

<script>
    import trimHtml from 'trim-html'
    import request from '~/net/request'
    import htmlUtil from '~/utils/html'

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
                    pageNo: context.query.pageNo || 1,
                    pageSize: 20
                }
            }).then(res => {
                let articles = res.data.articles || []
                for (let i = 0; i < articles.length; i++) {
                    let limit = 100
                    let more = `...&nbsp;&nbsp;<a href="/topic/${articles[i].id}" target="_blank" class="golang123-digest-continue">继续阅读»</a>`
                    let trimObj = trimHtml(articles[i].htmlContent, {
                        limit: limit,
                        suffix: more, // string that will be appended at the end
                        moreLink: false
                    })
                    let content = trimObj.html
                    content = htmlUtil.trimImg(content)
                    if (!trimObj.more) {
                        let newTrimObj = trimHtml(articles[i].htmlContent, {
                            limit: limit,
                            preserveTags: false // Strip HTML tags (default true)
                        })
                        content = newTrimObj.html + more
                    }
                    articles[i].htmlContent = content
                }
                return {
                    pageNo: res.data.pageNo,
                    pageSize: res.data.pageSize,
                    totalCount: res.data.totalCount,
                    totalPage: res.data.totalPage,
                    articles: articles,
                    userId: context.params.id,
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
        },
        methods: {
            onPageChange (value) {
                let userId = this.userId
                window.location.href = `/user/${userId}?pageNo=${value}`
            }
        }
    }
</script>
