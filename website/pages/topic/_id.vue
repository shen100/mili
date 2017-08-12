<template>
    <div>
        <app-header :userStatus="user" />
        <div class="golang-home-body">
            <div class="golang-home-body-left">
                <div class="detail-title-box">
                    <p class="article-detail-title">{{article.name}}</p>
                    <p class="article-title-info">
                        <span class="article-title-info-item">
                            发布于14小时前
                        </span>
                        <span class="article-title-info-item">
                            作者xxxxx
                        </span>
                        <span class="article-title-info-item">
                            111次浏览
                        </span>
                        <span class="article-title-info-item">
                            来自
                            {{article.categories[0].name}}
                        </span>
                    </p>
                </div>
                <div class="home-articles-box">
                    <div class="golang123-editor" v-html="article.content"></div>
                </div>
            </div>
            <app-sidebar />
        </div>
        <app-footer />
    </div>
</template>

<script>
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import Sidebar from '~/components/article/ArticleSidebar'
    import request from '~/net/request'

    export default {
        data () {
            return {}
        },
        asyncData (context) {
            let reqArr = [
                request.getCategories({client: context.req}),
                request.getArticle({
                    client: context.req,
                    params: {
                        id: context.params.id
                    }
                })
            ]
            if (context.user) {
                reqArr.push(request.getRecentArticles({client: context.req}))
            }
            return Promise
                .all(reqArr)
                .then(arr => {
                    return {
                        user: context.user,
                        article: arr[1].data.article
                    }
                })
        },
        head () {
            return {
                title: this.article.name + ' - '
            }
        },
        middleware: 'userInfo',
        components: {
            'app-header': Header,
            'app-footer': Footer,
            'app-sidebar': Sidebar
        }
    }
</script>

<style>
    @import '~assets/styles/article/detail.css'
</style>
