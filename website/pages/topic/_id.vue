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
        </div>
    </div>
</template>

<script>
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
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
        middleware: 'userInfo',
        components: {
            'app-header': Header,
            'app-footer': Footer
        },
        mounted () {
            console.log(this.article)
        }
    }
</script>

<style>
    @import '~assets/styles/article/detail.css'
</style>