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
                        <a :href="'/user/' + article.user.id" target="_blank" class="user-icon-box"><img :src="article.user.avatarURL" alt=""/></a>
                        <span class="home-tip-container">
                            <Tooltip :content="`回复数${article.commentCount}　浏览数${article.browseCount}`" placement="bottom-start" class="home-tip-box">
                                <a :href="'/topic/' + article.id" target="_blank" class="no-underline">
                                    <span class="articles-click-num">{{article.commentCount}}</span>
                                    <span class="articles-num-split">/</span>
                                    <span class="articles-res-num">{{article.browseCount}}</span>
                                </a>
                            </Tooltip>
                        </span>
                        <span class="articles-categoties" :class="article.isTop ? 'articles-categoties-top' : 'articles-categoties-common' ">{{article.isTop ? '置顶' : article.categories[0].name}}</span>
                        <a :href="'/topic/' + article.id" target="_blank" class="home-articles-title" :title="article.name">{{article.name}}</a>
                        <p class="articles-res-time">{{article.createdAt | getReplyTime}}</p>
                        <a v-if="article.lastUser && article.lastUser.id" :href="'/user/' + article.lastUser.id" target="_blank" class="user-small-icon-box"><img :src="article.lastUser.avatarURL" alt=""/></a>
                    </div>

                    <div v-if="articles.length > 0" style="text-align: center;">
                        <span v-if="totalVisible" class="ivu-page-total" style="margin-top: 10px;vertical-align: top;">共 {{totalCount}} 条</span>
                        <Page class="common-page" :class="{'common-page-inline': totalVisible}"
                            :current="pageNo"
                            :page-size="pageSize"
                            :total="totalCount"
                            @on-change="onPageChange"
                            :show-elevator="true"/>
                    </div>
                </div>
            </div>
            <app-sidebar :score="score" :user="user" :userLoginVisible="true" :maxComment="maxComment" :pubTopic="true" :maxBrowse="maxBrowse"/>
        </div>
        <app-footer />
        <BackTop></BackTop>
    </div>
</template>

<script>
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import Sidebar from '~/components/Sidebar'
    import request from '~/net/request'
    import dateTool from '~/utils/date'

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
                        cateId: query.cate || '',
                        pageNo: query.pageNo || 1
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
                }),
                request.getTopList({
                    client: context.req
                })
            ]).then(data => {
                let categories = data[0].data.categories || []
                let articles = data[1].data.articles || []
                let pageNo = data[1].data.pageNo
                let totalCount = data[1].data.totalCount
                let pageSize = data[1].data.pageSize
                let score = data[2].data.users
                let user = context.user
                let cate = query.cate || ''
                let maxComment = data[3].data.articles || []
                let maxBrowse = data[4].data.articles || []
                let topList = (data[5] && data[5].data.articles) || []
                articles.map(items => {
                    items.isTop = false
                })
                if (!query.pageNo || parseInt(query.pageNo) < 2) {
                    topList.map(items => {
                        items.isTop = true
                    })
                    articles = topList.concat(articles)
                }

                return {
                    totalVisible: process.env.NODE_ENV !== 'production',
                    categories: categories,
                    articles: articles,
                    totalCount: totalCount,
                    pageNo: pageNo,
                    pageSize: pageSize,
                    score: score,
                    user: user,
                    cate: cate,
                    maxComment: maxComment,
                    maxBrowse: maxBrowse
                }
            }).catch(err => {
                console.log(err.message)
                context.error({ message: 'Not Found', statusCode: 404 })
            })
        },
        head () {
            return {
                title: '首页'
            }
        },
        middleware: 'userInfo',
        filters: {
            getReplyTime: dateTool.getReplyTime
        },
        methods: {
            onPageChange (value) {
                window.location.href = `/?cate=${this.cate}&pageNo=${value}`
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
    @import '../assets/styles/home.css'
</style>
