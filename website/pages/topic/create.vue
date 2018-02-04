<template>
    <div>
        <article-save :categories="categories" :article="article" :recentArticles="recentArticles" :hasRecentArticles="hasRecentArticles" :id="id" :user="user"></article-save>
    </div>
</template>

<script>
    import request from '~/net/request'
    import ArticleSave from '~/components/article/save'

    export default {
        data () {
        },
        asyncData (context) {
            return Promise.all([
                request.getCategories({client: context.req}),
                request.getUserArticles({
                    client: context.req,
                    params: {
                        userID: context.user.id
                    },
                    query: {
                        orderType: 1,
                        desc: 1,
                        pageSize: 5
                    }
                })
            ]).then(function (arr) {
                let categories = arr[0].data.categories
                let recentArticles = arr[1].data.articles || []
                let hasRecentArticles = false
                if (recentArticles && recentArticles.length > 0) {
                    hasRecentArticles = true
                }
                return {
                    categories: categories,
                    article: null,
                    recentArticles: recentArticles,
                    hasRecentArticles: hasRecentArticles,
                    id: 0,
                    user: context.user
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        head () {
            return {
                title: '发布话题',
                link: [
                    { rel: 'stylesheet', href: '/styles/editor/simplemde.min.css' }
                ]
            }
        },
        methods: {
        },
        middleware: 'userRequired',
        layout: 'nosidebar',
        components: {
            'article-save': ArticleSave
        }
    }
</script>

<style>
    @import '../../assets/styles/article/edit.css'
</style>
