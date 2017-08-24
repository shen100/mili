<template>
    <div>
        <app-header :user="user" />
        <div class="golang-home-body">
            <div class="golang-home-body-left">
                <div class="detail-title-box">
                    <p class="article-detail-title"><span class="articles-categoties">{{article.isTop ? '置顶' : article.categories[0].name}}</span><span v-html="article.name"></span></p>
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
                <div class="article-actions">
                    <div class="article-share">
                        <div class="article-share-btn">
                            <Icon type="android-star-outline" style="font-size: 20px;margin-top:-2px;"></Icon>
                            <span>收藏</span>
                        </div>
                        <div class="article-share-btn">
                            <Icon type="android-share-alt" style="font-size: 16px"></Icon>
                            <span>分享</span>
                        </div>
                        <div v-if="isAuthor" class="article-share-btn">
                            <Icon type="edit" style="font-size: 16px"></Icon>
                            <a :href="'/topic/edit/' + article.id"><span>编辑</span></a>
                        </div>
                    </div>
                </div>
                <div class="golang-cell comment-box">
                    <div class="title">{{article.commentCount > 0 ? article.commentCount : '暂无'}}回复</div>
                    <div class="comment-content">
                        <template v-if="article.commentCount > 0">
                            <div class="comment-item" v-for="(item, index) in article.comments">
                                <a class="reply-user-icon">
                                    <img :src="item.user.avatarURL" alt="">
                                </a>
                                <span class="reply-user-name">{{item.user.name}}</span>
                                <span class="reply-time">{{index + 1}}楼•{{item.createdAt | getReplyTime}}</span>
                                <div class="golang123-editor" v-html="item.content"></div>
                            </div>
                        </template>
                        <p class="not-signin" v-else>暂时还没有人回复过这个话题</p>
                        <p class="not-signin-padding not-signin-dividing" v-if="!article.commentCount && !user"></p>
                        <p class="not-signin" :class="{'comment-item': article.commentCount}" v-if="!user">要回复话题, 请先&nbsp;<a href="/signin">登录</a>&nbsp;或&nbsp;<a href="/signup">注册</a></p>
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
            <app-sidebar :user="user" :score="score" :maxComment="maxComment" :author="article.user" :maxBrowse="maxBrowse" :recentArticles="recentArticles"/>
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
    import Sidebar from '~/components/Sidebar'
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
            return request.getArticle({
                client: context.req,
                params: {
                    id: context.params.id
                }
            }).then(function (data) {
                let article = data.data.article
                if (!article) {
                    context.error({ statusCode: 404, message: 'Page not found' })
                    return
                }
                let reqArr = [
                    request.getMaxBrowse({
                        client: context.req
                    }),
                    request.getRecentArticles({
                        client: context.req,
                        params: {
                            userID: article.userID
                        }
                    }),
                    request.getTop10({
                        client: context.req
                    }),
                    request.getMaxComment({
                        client: context.req
                    }),
                    request.getTopList({
                        client: context.req
                    })
                ]
                return Promise.all(reqArr).then(arr => {
                    let maxBrowse = arr[0].data.articles
                    let recentArticles = arr[1].data.articles
                    let score = arr[2].data.users
                    let maxComment = arr[3].data.articles
                    let topList = arr[4].data.articles || []
                    topList.map(item => {
                        if (item.id === article.id) {
                            article.isTop = true
                        }
                    })
                    let isAuthor = context.user && context.user.id === article.user.id
                    return {
                        isAuthor: isAuthor,
                        user: context.user,
                        article: article,
                        maxBrowse: maxBrowse,
                        score: score,
                        maxComment: maxComment,
                        recentArticles: recentArticles
                    }
                })
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
                this.formData.content = content
            },
            onSubmit () {
                this.$refs['formData'].validate((valid) => {
                    if (!this.loading && valid) {
                        this.loading = true
                        request.commentCreate({
                            body: {
                                sourceId: parseInt(this.$route.params.id),
                                parentID: 0,
                                content: this.formData.content,
                                sourceName: 'article'
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
