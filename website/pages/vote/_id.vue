<template>
    <div>
        <app-header :user="user" />
        <div class="golang-home-body">
            <div class="golang-home-body-left">
                <div class="detail-title-box">
                    <p class="vote-detail-title"><span class="vote-categoties" :class="status ? 'vote-categoties-running' : 'vote-categoties-end'">{{status ? '进行中' : '已结束'}}</span>{{vote.name}}</p>
                    <p class="vote-title-info">
                        <span class="vote-title-info-item">
                            发布于{{vote.createdAt | getReplyTime}}
                        </span>
                        <span class="vote-title-info-item">
                            作者{{vote.user.name}}
                        </span>
                        <span class="vote-title-info-item">
                            {{vote.browseCount}}次浏览
                        </span>
                    </p>
                </div>
                <div class="home-vote-box">
                    <div class="golang123-editor" v-html="vote.content"></div>
                    <div class="">
                        <span v-for="item in vote.voteItems">
                            <Button type="primary" class="vote-item" @click="onVoteSubmit(item.id)">支持<span class="vote-item-label">{{item.name}}</span><span class="vote-item-label">{{item.count}}</span></Button>
                        </span>
                    </div>
                </div>
                <div class="golang-cell comment-box">
                    <div class="title">{{vote.commentCount > 0 ? vote.commentCount : '暂无'}}回复</div>
                    <div class="comment-content">
                        <template v-if="vote.commentCount">
                            <div class="comment-item" v-for="(item, index) in vote.comments">
                                <a class="reply-user-icon">
                                    <img src="~assets/images/head.png" alt="">
                                </a>
                                <span class="reply-user-name">{{item.user.name}}</span>
                                <span class="reply-time">{{index + 1}}楼•{{item.createdAt | getReplyTime}}</span>
                                <div class="golang123-editor" v-html="item.content"></div>
                            </div>
                        </template>
                        <p class="not-signin" v-else>暂时还没有人回复过这个话题</p>
                        <p class="not-signin-padding not-signin-dividing" v-if="!vote.commentCount && !user"></p>
                        <p class="not-signin" :class="{'comment-item': vote.commentCount}" v-if="!user">要回复话题请先<a href="/signin">登录</a>或<a href="/signup">注册</a></p>
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
            <!-- <app-sidebar :user="article.user" :maxBrowse="maxBrowse" :articles="recentArticles"/> -->
        </div>
        <app-footer />
    </div>
</template>

<script>
    import Vue from 'vue'
    import iview from 'iview'
    import moment from 'moment'
    import ErrorCode from '~/constant/ErrorCode'
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
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
            return request.getVote({
                client: context.req,
                params: {
                    id: context.params.id
                }
            }).then(res => {
                if (res.errNo === ErrorCode.SUCCESS) {
                    const vote = res.data
                    return {
                        vote: vote,
                        user: context.user,
                        status: moment().valueOf() < dateTool.parse(vote.endAt).valueOf()
                    }
                } else {
                    return context.error({ statusCode: 404, message: 'Page not found' })
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
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
                                sourceID: parseInt(this.$route.params.id),
                                parentID: 0,
                                content: this.formData.content,
                                sourceName: 'vote'
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.SUCCESS) {
                                this.formData.content = ''
                                this.$Message.success('评论提交成功')
                                return request.getVote({
                                    params: {
                                        id: this.$route.params.id
                                    }
                                })
                            } else {
                                return Promise.reject(new Error(res.msg))
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.SUCCESS) {
                                this.vote = res.data
                            }
                        }).catch(err => {
                            this.loading = false
                            this.$Message.error(err.message)
                        })
                    }
                })
            },
            onVoteSubmit (id) {
                if (!this.loading) {
                    this.loading = true
                    request.userVote({
                        params: {
                            id: id
                        }
                    }).then(res => {
                        this.loading = false
                        if (res.errNo === ErrorCode.SUCCESS) {
                            return request.getVote({
                                params: {
                                    id: this.$route.params.id
                                }
                            })
                        } else {
                            return Promise.reject(new Error(res.msg))
                        }
                    }).then(res => {
                        if (res.errNo === ErrorCode.SUCCESS) {
                            this.vote = res.data
                            this.$Message.success('投票成功')
                        }
                    }).catch(err => {
                        this.loading = false
                        this.$Message.error(err.message)
                    })
                }
            }
        },
        mounted () {
            console.log('111', this.vote)
        },
        head () {
            return {
                title: this.vote.name,
                link: [
                    { rel: 'stylesheet', href: '/styles/editor/simplemde.min.css' }
                ]
            }
        },
        filters: {
            getReplyTime: dateTool.getReplyTime
        },
        components: {
            'app-header': Header,
            'app-footer': Footer,
            'md-editor': editor
        }
    }
</script>

<style>
    @import '~assets/styles/vote/detail.css'
</style>