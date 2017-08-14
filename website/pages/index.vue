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
                        <Tooltip :content="'回复数120　浏览数11520'" placement="bottom-start" class="home-tip-box">
                            <span class="articles-click-num">120</span>
                            <span class="articles-num-split">/</span>
                            <span class="articles-res-num">11520</span>
                        </Tooltip>
                        <span class="articles-categoties">{{article.categories[0].name}}</span>
                        <a :href="'/topic/' + article.id" class="home-articles-title">{{article.name}}</a>
                        <p class="articles-res-time">2天前</p>
                        <a class="user-small-icon-box"><img src="~assets/images/head.png" alt=""></a>
                    </div>
                </div>
            </div>
            <app-sidebar :score="score" :user="user"/>
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
                })
            ]).then(data => {
                let categories = data[0].data.categories || []
                let articles = data[1].data.articles
                let score = data[2].data.users
                let user = context.user
                let cate = query.cate || ''
                return {
                    categories: categories,
                    articles: articles,
                    score: score,
                    user: user,
                    cate: cate
                }
            }).catch(err => {
                console.log(err)
                context.error({ message: 'Not Found', statusCode: 404 })
            })
        },
        head () {
            return {
                title: '首页 - '
            }
        },
        middleware: 'userInfo',
        mounted () {
            console.log(this.categories)
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
