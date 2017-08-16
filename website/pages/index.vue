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
                        <a class="user-icon-box"><img src="~assets/images/head.png" alt=""></a>
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
                        <a class="user-small-icon-box"><img src="~assets/images/head.png" alt=""></a>
                    </div>
                </div>
            </div>
            <app-sidebar :score="score" :user="user" :maxComment="maxComment" :maxBrowse="maxBrowse"/>
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

    Vue.use(iview)

    export default {
        data () {
            return {

            }
        },
        asyncData (context) {
            const query = context.query || {}
            console.log('1111', query)
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
            getReplyTime: (times) => {
                let time = new Date(times).getTime()
                let currentT = new Date().getTime()
                let diff = (currentT - time) / 1000
                if (diff < 60) {
                    return '刚刚'
                } else if (diff < 60 * 60) {
                    return `${parseInt(diff / 60)}分钟前`
                } else if (diff < 24 * 60 * 60) {
                    return `${parseInt(diff / 60 / 60)}小时前`
                } else {
                    return `${parseInt(diff / 24 / 60 / 60)}天前`
                }
            }
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
