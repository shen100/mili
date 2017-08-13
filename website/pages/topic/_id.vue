<template>
    <div>
        <app-header :user="user" />
        <div class="golang-home-body">
            <div class="golang-home-body-left">
                <div class="detail-title-box">
                    <p class="article-detail-title"><span class="articles-categoties">{{article.categories[0].name}}</span>{{article.name}}</p>
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
                    </p>
                </div>
                <div class="home-articles-box">
                    <div class="golang123-editor" v-html="article.content"></div>
                </div>
                <div class="golang-cell comment-box">
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
            <app-sidebar />
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
                title: this.article.name + ' - ',
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
                            } else {
                                this.$Message.error(res.msg)
                            }
                        }).catch(err => {
                            this.loading = false
                            this.$Message.error(err.msg)
                        })
                    }
                })
            }
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
