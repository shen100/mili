<template>
    <div>
        <app-header :user="user" />
        <div class="golang-home-body">
            <div class="golang-home-body-left">
                <div class="home-categoties-box">
                    <a href="/" class="categoties-item" :class="{'categoties-select': !cate}">全部</a>
                    <a v-for="cateItem in categories" class="categoties-item" :href="'/?cate=' + cateItem.id" :class="{'categoties-select': cateItem.id == cate}">{{cateItem.name}}</a>
                </div>
                <div class="home-articles-box">
                    <div v-for="article in articles" class="articles-cell">
                        <a class="user-icon-box"><img :src="article.user.avatarURL" alt=""></a>
                        <Tooltip :content="`回复数${article.commentCount}　浏览数${article.browseCount}`" placement="bottom-start" class="home-tip-box">
                            <a :href="'/topic/' + article.id">
                                <span class="articles-click-num">{{article.commentCount}}</span>
                                <span class="articles-num-split">/</span>
                                <span class="articles-res-num">{{article.browseCount}}</span>
                            </a>
                        </Tooltip>
                        <span class="articles-categoties">{{article.categories[0].name}}</span>
                        <a :href="'/topic/' + article.id" class="home-articles-title">{{article.name}}</a>
                        <p class="articles-res-time">{{article.createdAt | getReplyTime}}</p>
                        <a class="user-small-icon-box"><img :src="article.lastUser.avatarURL" alt=""></a>
                    </div>
                </div>
            </div>
            <app-sidebar :score="score" :user="user" :userLoginVisible="true" :maxComment="maxComment" :pubTopic="true" :maxBrowse="maxBrowse"/>
        </div>
        <app-footer />
    </div>
</template>

<script>
    import Vue from 'vue'
    import iview from 'iview'
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import Sidebar from '~/components/Sidebar'
    import request from '~/net/request'
    import dateTool from '~/utils/date'

    Vue.use(iview)

    export default {
        data () {
            return {

            }
        },
        asyncData (context) {
            const query = context.query || {}
            return Promise.all([
                request.getCategories({
                    client: context.req
                }),
                request.getArticles({
                    client: context.req,
                    query: {
                        cateId: query.cate || ''
                    }
                }),
                request.getTop10({
                    client: context.req
                }),
                request.getMaxComment({
                    client: context.req
                }),
                request.getMaxBrowse({
                    client: context.req
                })
            ]).then(data => {
                let categories = data[0].data.categories || []
                let articles = data[1].data.articles
                let score = data[2].data.users
                let user = context.user
                let cate = query.cate || ''
                let maxComment = data[3].data.articles
                let maxBrowse = data[4].data.articles
                return {
                    categories: categories,
                    articles: articles,
                    score: score,
                    user: user,
                    cate: cate,
                    maxComment: maxComment,
                    maxBrowse: maxBrowse
                }
            }).catch(err => {
                console.log(err)
                context.error({ message: 'Not Found', statusCode: 404 })
            })
        },
        head () {
            return {
                title: '首页'
            }
        },
        middleware: 'userInfo',
        mounted () {
            console.log(this.maxComment, this.maxBrowse)
        },
        filters: {
            getReplyTime: dateTool.getReplyTime
        },
        components: {
            'app-header': Header,
            'app-footer': Footer,
            'app-sidebar': Sidebar
        }
    }
</script>

<style>
    @import '~assets/styles/home.css'
</style>
