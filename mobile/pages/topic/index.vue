<template>
    <div class="article-list-box">
        <ul class="category-nav">
            <li><a :class="{'category-select': !cate}" href="/">全部</a></li>
            <li :id="c.id" v-for="c in categories"><a :class="{'category-select': c.id == cate}" :href="'/?cate=' + c.id">{{c.name}}</a></li>
        </ul>
        <div class="article-list-container">
            <ul class="article-list">
                <li v-for="article in articles" class="article-item">
                    <a class="article-item-link" :href="`/topic/${article.id}`">
                        <h3 class="article-title">{{article.name | entity2HTML}}</h3>
                        <div class="article-property-box">
                            <span class="article-category article-property">{{article.categories[0].name}}</span>
                            <span class="article-property">{{article.user.name}}</span>
                            <span  class="article-property">回复&nbsp;{{article.commentCount}}</span>
                            <span  class="article-property">{{article.createdAt | getReplyTime}}</span>
                        </div>
                    </a>
                </li>
            </ul>
            <div v-if="loadMoreVisible" @click="loadArticles" class="articles-loading"><span class="articles-loading-txt">展开更多话题</span><x-icon class="articles-loading-color" type="ios-arrow-down" size="30"></x-icon></div>
            <div id="topicAdBox">
                <baiduAd20x3 />
            </div>
        </div>
    </div>
</template>

<script>
    import request from '~/net/request'
    import dateTool from '~/utils/date'
    import htmlUtil from '~/utils/html'
    import baiduAd20x3 from '~/components/ad/baidu/ad20x3'

    export default {
        data () {
            return {
                isLoading: false,
                loadMoreVisible: true
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
                        pageNo: query.pageNo || 1,
                        noContent: 'true'
                    }
                })
            ]).then(data => {
                let categories = data[0].data.categories || []
                let articles = data[1].data.articles || []
                let pageNo = data[1].data.pageNo
                let totalCount = data[1].data.totalCount
                let pageSize = data[1].data.pageSize
                let user = context.user
                let cate = query.cate || ''

                let totalPage = Math.ceil(totalCount / pageSize)
                let allLoaded = false
                if (pageNo >= totalPage) {
                    allLoaded = true
                }

                return {
                    totalVisible: process.env.NODE_ENV !== 'production',
                    categories: categories,
                    articles: articles,
                    totalCount: totalCount,
                    pageNo: pageNo,
                    pageSize: pageSize,
                    totalPage: totalPage,
                    user: user,
                    cate: cate,
                    allLoaded: allLoaded
                }
            }).catch(err => {
                console.log(err.message)
                context.error({ message: 'Not Found', statusCode: 404 })
            })
        },
        head () {
            return {
                title: '话题'
            }
        },
        methods: {
            loadArticles () {
                let self = this
                if (self.isLoading) {
                    return
                }
                self.isLoading = true
                request.getArticles({
                    query: {
                        cateId: self.cate,
                        pageNo: self.pageNo + 1,
                        noContent: 'true'
                    }
                }).then((res) => {
                    self.isLoading = false
                    let articles = res.data.articles || []
                    self.articles = self.articles.concat(articles)
                    self.pageNo = res.data.pageNo
                    self.totalCount = res.data.totalCount
                    self.pageSize = res.data.pageSize
                    self.totalPage = Math.ceil(self.totalCount / self.pageSize)
                    if (self.pageNo >= self.totalPage) {
                        self.allLoaded = true
                        self.loadMoreVisible = false
                    } else {
                        self.loadMoreVisible = true
                    }
                }).catch((err) => {
                    console.log(err)
                    self.isLoading = false
                })
            }
        },
        components: {
            'baiduAd20x3': baiduAd20x3
        },
        filters: {
            getReplyTime: dateTool.getReplyTime,
            entity2HTML: htmlUtil.entity2HTML
        }
    }
</script>

<style lang="less">
    @import '../../assets/styles/topic/list.less';
</style>
