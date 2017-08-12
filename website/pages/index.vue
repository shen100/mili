<template>
    <div>
        <app-header />
        <div class="golang-home-body">
            <div class="golang-home-body-left">
                <div class="home-categoties-box">
                    <div class="categoties-item" :class="{'categoties-select': cate}"><a href="/">全部</a></div>
                    <div v-for="cateItem in categories" class="categoties-item" :class="{'categoties-select': cateItem.select}"><a :href="'/?cate=' + cateItem.id">{{cateItem.name}}</a></div>
                </div>
                <div class="home-articles-box">
                    <div v-for="article in articles" class="articles-cell">
                        <a class="user-icon-box"><img src="~assets/images/head.png" alt=""></a>
                        <span class="articles-click-num" title="回复数">120</span>
                        <span class="articles-num-split">/</span>
                        <span class="articles-res-num" title="点击数">11520</span>
                        <span v-for="cItem in categories" class="articles-categoties">{{cItem.name}}</span>
                        <a :href="'/topic/' + article.id" class="home-articles-title">{{article.name}}</a>
                        <p class="articles-res-time">2天前</p>
                        <a class="user-small-icon-box"><img src="~assets/images/head.png" alt=""></a>
                    </div>
                </div>
            </div>
            <app-sidebar :score="score" :user="user" :userStatus="userStatus"/>
        </div>
        <app-footer />
    </div>
</template>

<script>
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import Sidebar from '~/components/Sidebar'
    import request from '~/net/request'

    export default {
        data () {
            return {

            }
        },
        asyncData (context) {
            const query = context.req.query || {}
            return Promise.all([
                request.getCategories({
                    client: context.req
                }),
                request.getArticles({
                    client: context.req
                }),
                request.getTop10({
                    client: context.req
                }),
                request.getUserInfo({
                    client: context.req
                })
            ]).then(data => {
                let categories = data[0].data.categories || []
                let articles = data[1].data.articles
                let score = data[2].data.users
                let userStatus = !!data[3].data.user
                let user = data[3].data.user || {}
                let cate = query.cate || false

                if (query.cate) {
                    categories.map(item => {
                        if (item.id === query.cate) {
                            item.select = true
                        }
                    })
                }
                return {
                    categories: categories,
                    articles: articles,
                    score: score,
                    userStatus: userStatus,
                    user: user,
                    cate: cate
                }
            }).catch(err => {
                console.log(err)
                context.error({ message: 'Not Found', statusCode: 404 })
            })
        },
        mounted () {
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
