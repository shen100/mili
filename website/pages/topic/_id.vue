<template>
    <div>
        <app-header :user="user" />
        <div class="golang-home-body">
            <div class="golang-home-body-left">
                <div class="detail-title-box">
                    <p class="article-detail-title"><span class="articles-categoties">{{article.categories[0].name}}</span>{{article.name}}</p>
                    <p class="article-title-info">
                        <span class="article-title-info-item">
                            发布于{{article.createdAt | getReplyTime}}
                        </span>
                        <span class="article-title-info-item">
                            作者{{article.user.name}}
                        </span>
                        <span class="article-title-info-item">
                            {{article.browseCount}}次浏览
                        </span>
                    </p>
                </div>
                <div class="home-articles-box">
                    <div class="golang123-editor" v-html="article.content"></div>
                </div>
                <div class="golang-cell comment-box" v-if="article.comments.length > 0">
                    <div class="title">{{article.comments.length}}回复</div>
                    <div class="comment-content">
                        <div class="comment-item" v-for="(item, index) in article.comments">
                            <a class="reply-user-icon">
                                <img src="~assets/images/head.png" alt="">
                            </a>
                            <span class="reply-user-name">{{item.user.name}}</span>
                            <span class="reply-time">{{index + 1}}楼•{{item.createdAt | getReplyTime}}</span>
                            <div class="golang123-editor" v-html="item.content"></div>
                        </div>
                    </div>
                </div>
                <div class="golang-cell comment-box" v-if="user">
                    <div class="title">添加回复</div>
                    <div class="comment-content">
                        <Form ref="formData" :model="formData" :rules="formRule">
                            <Form-item prop="content">
                                <md-editor :value="formData.content" @change="onContentChage" />
                            </Form-item>
                        </Form>
                        <Button type="primary" @click="onSubmit">发表回复</Button>
                    </div>
                </div>
            </div>
            <app-sidebar :user="article.user" :maxBrowse="maxBrowse" />
        </div>
        <app-footer />
    </div>
</template>

<script>
    import Vue from 'vue'
    import iview from 'iview'
    import ErrorCode from '~/constant/ErrorCode'
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import Sidebar from '~/components/article/ArticleSidebar'
    import editor from '~/components/article/editor'
    import request from '~/net/request'
    import dateTool from '~/utils/date'

    Vue.use(iview)

    export default {
        data () {
            return {
                loading: false,
                formData: {
                    content: ''
                },
                formRule: {
                    content: [
                        { required: true, message: '请输入回复内容', trigger: 'blur' }
                    ]
                }
            }
        },
        validate ({ params }) {
            var hasId = !!params.id
            return hasId
        },
        asyncData (context) {
            let reqArr = [
                request.getCategories({client: context.req}),
                request.getArticle({
                    client: context.req,
                    params: {
                        id: context.params.id
                    }
                }),
                request.getMaxBrowse({
                    client: context.req
                })
            ]
            if (context.user) {
                reqArr.push(request.getRecentArticles({client: context.req}))
            }
            return Promise
                .all(reqArr)
                .then(arr => {
                    let article = arr[1].data.article
                    let maxBrowse = arr[2].data.articles
                    if (!article) {
                        context.error({ statusCode: 404, message: 'Page not found' })
                        return
                    }
                    return {
                        user: context.user,
                        article: article,
                        maxBrowse: maxBrowse
                    }
                }).catch(err => {
                    console.log(err)
                    context.error({ statusCode: 404, message: 'Page not found' })
                })
        },
        head () {
            return {
                title: this.article.name,
                link: [
                    { rel: 'stylesheet', href: '/styles/editor/simplemde.min.css' }
                ]
            }
        },
        middleware: 'userInfo',
        methods: {
            onContentChage (content) {
                console.log('11111', content)
                this.formData.content = content
            },
            onSubmit () {
                this.$refs['formData'].validate((valid) => {
                    if (!this.loading && valid) {
                        this.loading = true
                        request.commentCreate({
                            body: {
                                articleID: parseInt(this.$route.params.id),
                                parentID: 0,
                                content: this.formData.content
                            }
                        }).then(res => {
                            this.loading = false
                            if (res.errNo === ErrorCode.SUCCESS) {
                                this.formData.content = ''
                                this.$Message.success('评论提交成功')
                                return request.getArticle({
                                    params: {
                                        id: this.$route.params.id
                                    }
                                })
                            } else {
                                return Promise.reject(new Error(res.msg))
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.SUCCESS) {
                                this.article = res.data.article
                            }
                        }).catch(err => {
                            this.loading = false
                            this.$Message.error(err.message)
                        })
                    }
                })
            }
        },
        mounted () {
            console.log(this.article)
        },
        filters: {
            getReplyTime: dateTool.getReplyTime
        },
        components: {
            'app-header': Header,
            'app-footer': Footer,
            'app-sidebar': Sidebar,
            'md-editor': editor
        }
    }
</script>

<style>
    @import '~assets/styles/article/detail.css'
</style>
