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
                    <div class="vote-actions">
                        <div class="vote-share">
                            <div class="vote-share-btn">
                                <Icon type="android-star-outline" style="font-size: 20px;margin-top:-2px;"></Icon>
                                <span>收藏</span>
                            </div>
                            <div class="vote-share-btn">
                                <Icon type="android-share-alt" style="font-size: 16px"></Icon>
                                <span>分享</span>
                            </div>
                            <template v-if="isAuthor">
                                <div class="vote-share-btn">
                                    <Icon type="edit" style="font-size: 16px"></Icon>
                                    <a :href="'/topic/edit/' + vote.id"><span>编辑</span></a>
                                </div>
                                <div class="vote-share-btn">
                                    <Icon type="android-delete" style="font-size: 17px;"></Icon>
                                    <span @click="onDelete">删除</span>
                                </div>
                            </template>
                        </div>
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
                                <a class="reply-user-name">{{item.user.name}}</a>
                                <span class="reply-time">{{index + 1}}楼•{{item.createdAt | getReplyTime}}</span>
                                <div class="golang123-editor" v-html="item.content"></div>
                            </div>
                        </template>
                        <p class="not-signin" v-if="!vote.commentCount && user">暂时还没有人回复过这个投票</p>
                        <p class="not-signin" v-if="!vote.commentCount && !user">暂时还没有人回复过这个投票,&nbsp;要回复投票, 请先&nbsp;<a @click="onSignin">登录</a>&nbsp;或&nbsp;<a href="/signup">注册</a></p>
                        <p class="not-signin not-signin-border" v-if="vote.commentCount && !user">要回复投票, 请先&nbsp;<a @click="onSignin">登录</a>&nbsp;或&nbsp;<a href="/signup">注册</a></p>
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
                        <Button type="primary" @click="onSubmitReply">发表回复</Button>
                    </div>
                </div>
            </div>
            <app-sidebar :score="score" :votesMaxBrowse="votesMaxBrowse" :votesMaxComment="votesMaxComment"/>
        </div>
        <app-footer />
    </div>
</template>

<script>
    import ErrorCode from '~/constant/ErrorCode'
    import VoteStatus from '~/constant/VoteStatus'
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import Sidebar from '~/components/Sidebar'
    import Editor from '~/components/Editor'
    import request from '~/net/request'
    import dateTool from '~/utils/date'

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
            return Promise.all([
                request.getVote({
                    client: context.req,
                    params: {
                        id: context.params.id
                    }
                }),
                request.getVoteMaxBrowse({
                    client: context.req
                }),
                request.getVoteMaxComment({
                    client: context.req
                }),
                request.getTop10({
                    client: context.req
                })
            ]).then(arr => {
                let vote = arr[0].data
                let votesMaxBrowse = arr[1].data.votes
                let votesMaxComment = arr[2].data.votes
                let score = arr[3].data.users
                let isAuthor = context.user && context.user.id === vote.user.id
                return {
                    isAuthor: isAuthor,
                    vote: vote,
                    user: context.user,
                    votesMaxBrowse: votesMaxBrowse,
                    votesMaxComment: votesMaxComment,
                    score: score,
                    status: vote.status === VoteStatus.VOTE_UNDERWAY
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        middleware: 'userInfo',
        methods: {
            onSignin () {
                location.href = '/signin?ref=' + encodeURIComponent(location.href)
            },
            onDelete () {
                let self = this
                this.$Modal.confirm({
                    title: '删除投票',
                    content: '确认删除这个投票?',
                    onOk () {
                        request.deleteVote({
                            params: {
                                id: self.vote.id
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.SUCCESS) {
                                self.$Message.success('已删除!')
                                setTimeout(function () {
                                    location.href = '/vote'
                                }, 500)
                            } else {
                                self.$Message.error(res.msg)
                            }
                        }).catch(err => {
                            err = '内部错误'
                            self.$Message.error(err)
                        })
                    },
                    onCancel () {

                    }
                })
            },
            onContentChage (content) {
                this.formData.content = content
            },
            onSubmitReply () {
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
            'app-sidebar': Sidebar,
            'md-editor': Editor
        }
    }
</script>

<style>
    @import '~assets/styles/vote/detail.css'
</style>
