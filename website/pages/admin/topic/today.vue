<template>
    <Row>
        <article-list :categories="categories"
            :list="list"
            :totalCount="totalCount"
            :pageNo="pageNo"
            :pageSize="pageSize"
            :cate="cate"
            :topList="topList"
            :siteTitle="'今日话题'"
            :path="'today'"/>
    </Row>
</template>

<script>
    import Request from '~/net/request'
    import ArticleList from '~/components/admin/ArticleList'

    export default {
        asyncData (context) {
            const query = context.query || {}
            const now = new Date()
            return Promise.all([
                Request.getCategories({
                    client: context.req
                }),
                Request.getTopList({
                    client: context.req
                }),
                Request.getAdminArticles({
                    client: context.req,
                    query: {
                        cateId: query.cateId || '',
                        pageNo: query.pageNo || 1,
                        startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
                    }
                })
            ]).then(arr => {
                let categories = arr[0].data.categories || []
                let topList = arr[1].data.articles || []
                let list = arr[2].data.articles || []
                let pageNo = arr[2].data.pageNo
                let totalCount = arr[2].data.totalCount
                let pageSize = arr[2].data.pageSize
                categories.unshift({
                    id: 0,
                    name: '全部'
                })
                for (let i = 0; i < list.length; i++) {
                    list[i].statusVisible = false
                }
                return {
                    totalVisible: true,
                    categories: categories,
                    list: list,
                    totalCount: totalCount,
                    pageNo: pageNo,
                    pageSize: pageSize,
                    cate: parseInt(query.cateId) || 0,
                    topList: topList
                }
            }).catch(err => {
                console.log(err)
                context.error({ message: 'Not Found', statusCode: 404 })
            })
        },
        head () {
            return {
                title: '今日话题'
            }
        },
        methods: {
        },
        components: {
            'article-list': ArticleList
        },
        layout: 'admin'
    }
</script>
