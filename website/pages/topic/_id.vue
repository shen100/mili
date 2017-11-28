<template>
    <div>
        <app-header :user="user" />
        <div class="golang-home-body">
            <div class="golang-home-body-left">
                <div class="detail-title-box">
                    <div class="article-detail-title"><span class="articles-categoties">{{article.categories[0].name}}</span><h1>{{article.name}}</h1></div>
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
                        <div class="article-share-btn" @click="collect">
                            <Icon type="android-star-outline" style="font-size: 20px;margin-top:-2px;"></Icon>
                            <span>收藏</span>
                        </div>
                        <div class="article-share-btn">
                            <Icon type="android-share-alt" style="font-size: 16px"></Icon>
                            <span>分享</span>
                        </div>
                        <template v-if="isAuthor">
                            <div class="article-share-btn">
                                <Icon type="edit" style="font-size: 16px"></Icon>
                                <a :href="'/topic/edit/' + article.id"><span>编辑</span></a>
                            </div>
                            <div class="article-share-btn">
                                <Icon type="android-delete" style="font-size: 17px;"></Icon>
                                <span @click="onDelete">删除</span>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="golang-cell comment-box">
                    <div class="title">{{article.commentCount > 0 ? article.commentCount : '暂无'}}回复</div>
                    <div class="comment-content">
                        <template v-if="article.commentCount > 0">
                            <div class="comment-item" v-for="(item, index) in article.comments">
                                <a :href="'/user/' + item.user.id" target="_blank" class="reply-user-icon">
                                    <img :src="item.user.avatarURL" alt="">
                                </a>
                                <a :href="'/user/' + item.user.id" target="_blank" class="reply-user-name">{{item.user.name}}</a>
                                <span class="reply-time">{{index + 1}}楼•{{item.createdAt | getReplyTime}}</span>
                                <div class="comment-actions">
                                    <div v-if="user && user.id === item.user.id" class="comment-delete" @click="onCommentDelete(item.id)">
                                        <Icon type="android-delete" style="font-size: 17px;"></Icon>
                                        <span class="comment-delete-txt">删除</span>
                                    </div>
                                </div>
                                <div class="golang123-editor" v-html="item.content"></div>
                            </div>
                        </template>
                        <p class="not-signin" v-if="!article.commentCount && user">暂时还没有人回复过这个话题</p>
                        <p class="not-signin" v-if="!article.commentCount && !user">暂时还没有人回复过这个话题,&nbsp;要回复话题, 请先&nbsp;<a @click="onSignin">登录</a>&nbsp;或&nbsp;<a href="/signup">注册</a></p>
                        <p class="not-signin not-signin-border" v-if="article.commentCount && !user">要回复话题, 请先&nbsp;<a @click="onSignin">登录</a>&nbsp;或&nbsp;<a href="/signup">注册</a></p>
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
            <app-sidebar :user="user" :score="score" :maxComment="maxComment" :author="article.user" :maxBrowse="maxBrowse" :recentArticles="recentArticles"/>
        </div>
        <app-footer />
        <Modal
            v-model="collectShow"
            class="collect-modal"
            title="添加收藏"
            @on-cancel="cancel">
            <Row
                class="not-signin-dividing collect-row"
                type="flex"
                justify="space-between"
                align="middle"
                v-for="(item, index) in collectDirList" key="index">
                <div>
                    <a :href="`/user/collect/${user.id}?collect=${item.id}`" target="_blank" class="collects-item-label">{{item.name}}</a>
                    <p class="collects-item-num">{{(item.collects && item.collects.length) || 0}}条内容</p>
                </div>
                <Button v-if="item.hasCollect" class="info-button" style="width: 80px" disabled="disabled">已收藏</Button>
                <Button v-else class="info-button" style="width: 80px" @click="createCollect(item.id)">收藏</Button>
            </Row>
            <Button
                type="primary"
                size="large"
                class="collect-dir-btn" @click="createCollectDir">创建收藏夹</Button>
            <div slot="footer"></div>
        </Modal>
        <Modal
            v-model="collectShowDir"
            class="collect-modal"
            title="创建新收藏夹"
            @on-cancel="cancel">
            <Form
                ref="CollectDir"
                :model="collectData"
                :rules="collectRule">
                <Form-item prop="title">
                    <i-input
                        v-model="collectData.title"
                        placeholder="收藏夹名称"
                        size="large"/>
                </Form-item>
            </Form>
            <Row type="flex" justify="space-between">
                <Button type="ghost" style="width:48%" @click="collect">返回</Button>
                <Button type="primary" style="width:48%" @click="submitCollectDir">确认创建</Button>
            </Row>
            <div slot="footer"></div>
        </Modal>
        <BackTop></BackTop>
    </div>
</template>

<script>
    import { ArticleContentType } from '~/constant/Article'
    import ErrorCode from '~/constant/ErrorCode'
    import UserStatus from '~/constant/UserStatus'
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import Sidebar from '~/components/Sidebar'
    import Editor from '~/components/Editor'
    import request from '~/net/request'
    import dateTool from '~/utils/date'
    import {trim} from '~/utils/tool'

    export default {
        data () {
            return {
                collectShowDir: false,
                collectShow: false,
                loading: false,
                formData: {
                    content: ''
                },
                formRule: {
                    content: [
                        { required: true, message: '请输入回复内容', trigger: 'blur' }
                    ]
                },
                collectData: {
                    title: ''
                },
                collectRule: {
                    title: [
                        { required: true, message: '请输入收藏夹名称', trigger: 'blur' }
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
                if (article.contentType === ArticleContentType.ContentTypeMarkdown) {
                    article.content = article.content
                } else if (article.contentType === ArticleContentType.ContentTypeHTML) {
                    article.content = article.htmlContent
                }
                let reqArr = [
                    request.getMaxBrowse({
                        client: context.req
                    }),
                    request.getUserArticles({
                        client: context.req,
                        params: {
                            userID: article.userID
                        },
                        query: {
                            orderType: 1,
                            desc: 1,
                            pageSize: 5
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
                if (context.user) {
                    reqArr.push(request.getFoldersSource({
                        client: context.req
                    }))
                }
                return Promise.all(reqArr).then(arr => {
                    let maxBrowse = arr[0].data.articles
                    let recentArticles = arr[1].data.articles
                    let score = arr[2].data.users
                    let maxComment = arr[3].data.articles
                    let topList = arr[4].data.articles || []
                    let collectDirList = []
                    if (arr[5]) {
                        collectDirList = arr[5].data.folders || []
                        collectDirList.map(item => {
                            item.hasCollect = false
                            item.collects.map(items => {
                                if (items.sourceID === parseInt(context.params.id) && items.sourceName === 'collect_source_article') {
                                    item.hasCollect = true
                                }
                            })
                        })
                    }
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
                        recentArticles: recentArticles,
                        collectDirList: collectDirList
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
            onSignin () {
                location.href = '/signin?ref=' + encodeURIComponent(location.href)
            },
            onDelete () {
                let self = this
                this.$Modal.confirm({
                    title: '删除话题',
                    content: '确定要删除这个话题?',
                    onOk () {
                        request.deleteArticle({
                            params: {
                                id: self.article.id
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.SUCCESS) {
                                self.$Message.success('已删除!')
                                setTimeout(function () {
                                    location.href = '/'
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
                if (this.user && this.user.status === UserStatus.STATUS_IN_ACTIVE) {
                    this.$Message.error('账号未激活，不能回复话题')
                    return
                }
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
                            } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                                location.href = '/signin?ref=' + encodeURIComponent(location.href)
                                return Promise.reject(new Error(''))
                            } else if (res.errNo === ErrorCode.IN_ACTIVE) {
                                return Promise.reject(new Error('账号未激活，不能回复话题'))
                            } else {
                                return Promise.reject(new Error(res.msg))
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.SUCCESS) {
                                this.article = res.data.article
                            }
                        }).catch(err => {
                            this.loading = false
                            if (err.message) {
                                this.$Message.error(err.message)
                            }
                        })
                    }
                })
            },
            onCommentDelete (id) {
                request.deleteComment({
                    params: {
                        id: id
                    }
                }).then((res) => {
                })
            },
            collect () {
                if (!this.user) {
                    location.href = '/signin?ref=' + encodeURIComponent(location.href)
                    return
                }
                this.collectShowDir = false
                this.collectData.title = ''
                this.collectShow = true
            },
            cancel () {
                this.collectShowDir = false
                this.collectShow = false
                this.collectData.title = ''
            },
            createCollectDir () {
                this.collectShowDir = true
                this.collectShow = false
            },
            submitCollectDir () {
                this.$refs['CollectDir'].validate(valid => {
                    if (!this.loading && valid) {
                        this.loading = true
                        request.createCollectDir({
                            body: {
                                name: trim(this.collectData.title),
                                parentID: 0
                            }
                        }).then(res => {
                            this.loading = false
                            if (res.errNo === ErrorCode.SUCCESS) {
                                let collectDir = res.data
                                collectDir.hasCollect = false
                                collectDir.collects = collectDir.collects || []
                                this.collectDirList.unshift(collectDir)
                                this.collect()
                            } else {
                                this.$Message.error(res.msg)
                            }
                        }).catch(err => {
                            this.loading = false
                            this.$Message.error(err.message)
                        })
                    }
                })
            },
            createCollect (id) {
                if (this.loading) {
                    return
                }
                this.loading = true
                request.createCollect({
                    body: {
                        sourceName: 'collect_source_article',
                        sourceID: parseInt(this.$route.params.id),
                        folderID: id
                    }
                }).then(res => {
                    this.loading = false
                    if (res.errNo === ErrorCode.SUCCESS) {
                        let collectDirList = this.collectDirList || []
                        for (let i = 0; i < collectDirList.length; i++) {
                            if (collectDirList[i].id === id) {
                                collectDirList[i].hasCollect = true
                                collectDirList[i].collects.push(res.data)
                                break
                            }
                        }
                    } else {
                        this.$Message.error(res.msg)
                    }
                }).catch(err => {
                    this.loading = false
                    this.$Message.error(err.message)
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
            'md-editor': Editor
        }
    }
</script>

<style>
    @import '../../assets/styles/article/detail.css'
</style>
