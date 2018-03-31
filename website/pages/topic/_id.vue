<template>
    <div>
        <div>
            <div>
                <div class="topic-detail-box">
                    <div class="detail-title-box">
                        <div class="article-detail-title"><h1>{{article.name | entity2HTML}}</h1></div>
                        <p class="article-title-info">
                            <span class="article-title-info-item">
                                发布于&nbsp;{{article.createdAt | getReplyTime}}
                            </span>
                            <span class="article-title-info-item">
                                作者&nbsp;{{article.user.name}}
                            </span>
                            <span class="article-title-info-item">
                                {{article.browseCount}}次&nbsp;浏览
                            </span>
                            <span class="article-title-info-item">
                                版块&nbsp;{{article.categories[0].name}}
                            </span>
                        </p>
                    </div>
                    <div class="home-articles-box">
                        <div class="golang123-editor golang123-richtxt" v-html="article.htmlContent"></div>
                    </div>
                    <div class="article-actions">
                        <div class="article-share">
                            <div class="article-share-btn" @click="collect">
                                <Icon type="android-star-outline" style="font-size: 20px;margin-top:-2px;"></Icon>
                                <span>{{alreadyCollect ? '取消收藏' : '收藏'}}</span>
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
                </div>
                <baidu-banner900x110 />
                <div class="golang-cell comment-box">
                    <div class="title total-reply-count">{{article.commentCount > 0 ? article.commentCount : '暂无'}}回复</div>
                    <div class="comment-content">
                        <template v-if="article.commentCount > 0">
                            <div :id="`reply-${item.id}`" class="comment-item" v-for="(item, index) in article.comments">
                                <div class="reply-user-icon-box">
                                    <a :href="'/user/' + item.user.id" target="_blank" class="reply-user-icon">
                                        <img :src="item.user.avatarURL" alt="">
                                    </a>
                                </div>
                                <div class="reply-user-box">
                                    <div>
                                        <a :href="'/user/' + item.user.id" target="_blank" class="reply-user-name">{{item.user.name}}</a>
                                        <span class="reply-time">{{index + 1}}楼•{{item.createdAt | getReplyTime}}</span>
                                        <div class="comment-actions">
                                            <div v-if="user && user.id !== item.user.id" class="comment-reply" @click="onReplyUser(item)">
                                                <Icon type="reply" style="font-size: 17px;"></Icon>
                                                <span class="comment-reply-txt">回复</span>
                                            </div>
                                            <template v-if="user && user.id === item.user.id">
                                                <div class="comment-edit" @click="onCommentEdit(item)">
                                                    <Icon type="edit" style="font-size: 15px;"></Icon>
                                                    <span class="comment-edit-txt">编辑</span>
                                                </div>
                                                <div class="comment-delete" @click="onCommentDelete(item.id)">
                                                    <Icon type="android-delete" style="font-size: 17px;"></Icon>
                                                    <span class="comment-delete-txt">删除</span>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                    <div v-if="item.parentID" class="parent-comment">
                                        <template v-if="item.parents && item.parents.length">
                                            <span>对</span>
                                            <span><a :href="`/user/${item.parents[0].user.id}`" target="_blank"><img :src="item.parents[0].user.avatarURL"></a></span>
                                            <span><a :href="`/user/${item.parents[0].user.id}`" target="_blank" class="parent-comment-user">{{item.parents[0].user.name}}</a></span>
                                            <span><a :href="`/topic/${article.id}#reply-${item.parents[0].id}`">{{floorMap[item.parents[0].id]}}楼</a></span>
                                            <span>回复</span>
                                        </template>
                                        <template v-else>
                                            <span style="text-decoration: line-through;">此回复已被作者删除</span>
                                        </template>
                                    </div>
                                    <div v-if="!item.editReplyVisible" class="golang123-editor golang123-richtxt" v-html="item.htmlContent"></div>
                                    <div v-if="item.replyVisible || item.editReplyVisible">
                                        <div>
                                            <md-editor :user="user" :value="formData.content" @change="onContentChage" />
                                        </div>
                                        <Row>
                                            <Button @click="onEditOrSubmitReply(item)" type="primary">保存</Button>
                                            <Button @click="cancelReply" style="margin-left: 10px;" type="ghost">取消</Button>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <p class="not-signin" v-if="!article.commentCount && user">暂时还没有人回复过这个话题</p>
                        <p class="not-signin" v-if="!article.commentCount && !user">暂时还没有人回复过这个话题,&nbsp;要回复话题, 请先&nbsp;<a @click="onSignin">登录</a>&nbsp;或&nbsp;<a href="/signup">注册</a></p>
                        <p class="not-signin not-signin-border" v-if="article.commentCount && !user">要回复话题, 请先&nbsp;<a @click="onSignin">登录</a>&nbsp;或&nbsp;<a href="/signup">注册</a></p>
                    </div>
                </div>
                <div class="golang-cell comment-box" v-if="user && replyArticle">
                    <div class="title add-reply-title">添加回复</div>
                    <div class="comment-content">
                        <Form ref="formData" :model="formData" :rules="formRule">
                            <Form-item prop="content">
                                <md-editor :user="user" :value="formData.content" @change="onContentChage" />
                            </Form-item>
                        </Form>
                        <Button type="primary" @click="onSubmitReply">发表回复</Button>
                    </div>
                </div>
            </div>
        </div>
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
                    <a :href="`/user/collect/${user.id}?folder=${item.id}`" target="_blank" class="collects-item-label">{{item.name}}</a>
                    <p class="collects-item-num">{{(item.collects && item.collects.length) || 0}}条内容</p>
                </div>
                <Button v-if="item.hasCollect" class="info-button" style="width: 80px" disabled="disabled">已收藏</Button>
                <Button v-else-if="!alreadyCollect" class="info-button" style="width: 80px" @click="createCollect(item.id)">收藏</Button>
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
    </div>
</template>

<script>
    import config from '~/config'
    import htmlUtil from '~/utils/html'
    import ErrorCode from '~/constant/ErrorCode'
    import Editor from '~/components/Editor'
    import request from '~/net/request'
    import dateTool from '~/utils/date'
    import { trim } from '~/utils/tool'
    import baiduBanner900x110 from '~/components/ad/baidu/banner900x110'

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
                let reqArr = [
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
                    })
                ]
                if (context.user) {
                    reqArr.push(request.getFoldersSource({
                        client: context.req
                    }))
                }
                return Promise.all(reqArr).then(arr => {
                    let recentArticles = arr[0].data.articles
                    let collectDirList = []
                    let alreadyCollect = false
                    let alreadyCollectID = 0
                    if (arr[1]) {
                        collectDirList = arr[1].data.folders || []
                        collectDirList.map(item => {
                            item.hasCollect = false
                            item.collects.map(items => {
                                if (items.sourceID === parseInt(context.params.id) && items.sourceName === 'collect_source_article') {
                                    item.hasCollect = true
                                    alreadyCollect = true
                                    alreadyCollectID = items.id
                                }
                            })
                        })
                    }
                    let isAuthor = context.user && context.user.id === article.user.id
                    article.comments = article.comments || []
                    let floorMap = {}
                    for (let i = 0; i < article.comments.length; i++) {
                        article.comments[i].replyVisible = false
                        article.comments[i].editReplyVisible = false
                        floorMap[article.comments[i].id] = i + 1
                    }
                    context.store.commit('topicAuthor', article.user)
                    context.store.commit('authorRecentArticles', recentArticles)
                    return {
                        isAuthor: isAuthor,
                        user: context.user,
                        replyArticle: true, // 直接回复话题的编辑器是否显示(即parentCommentID为0)
                        parentCommentID: 0,
                        floorMap: floorMap,
                        article: article,
                        recentArticles: recentArticles,
                        collectDirList: collectDirList,
                        alreadyCollect: alreadyCollect,
                        alreadyCollectID: alreadyCollectID
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
                    { rel: 'stylesheet', href: '/styles/editor/simplemde.min.css' },
                    { rel: 'stylesheet', href: '/styles/highlight/codestyle.css' } // Solarized Light
                ],
                script: [
                    { src: '/javascripts/highlight/highlight.min.js' }
                ]
            }
        },
        methods: {
            onSignin () {
                location.href = '/signin?ref=' + encodeURIComponent(location.href)
            },
            onDelete () {
                if (this.loading) {
                    return
                }
                this.loading = true
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
                            self.loading = false
                            if (res.errNo === ErrorCode.SUCCESS) {
                                self.$Message.success({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: '已删除!'
                                })
                                setTimeout(function () {
                                    location.href = '/'
                                }, 500)
                            } else {
                                self.$Message.error({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: res.msg
                                })
                            }
                        }).catch(err => {
                            self.loading = false
                            err = '内部错误'
                            self.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: err
                            })
                        })
                    },
                    onCancel () {

                    }
                })
            },
            onContentChage (content) {
                this.formData.content = content
            },
            onReplyUser (comment) {
                // 对回复进行回复
                let commentID = comment.id
                for (let i = 0; i < this.article.comments.length; i++) {
                    this.article.comments[i].replyVisible = false
                    this.article.comments[i].editReplyVisible = false
                    if (this.article.comments[i].id === commentID) {
                        this.article.comments[i].replyVisible = true
                    }
                }
                this.parentCommentID = commentID
                this.replyArticle = false
            },
            onCommentEdit (comment) {
                // 编辑回复
                let commentID = comment.id
                for (let i = 0; i < this.article.comments.length; i++) {
                    this.article.comments[i].replyVisible = false
                    this.article.comments[i].editReplyVisible = false
                    if (this.article.comments[i].id === commentID) {
                        this.article.comments[i].editReplyVisible = true
                    }
                }
                this.parentCommentID = comment.parentID
                this.replyArticle = false
                this.formData.content = comment.content
            },
            cancelReply () {
                for (let i = 0; i < this.article.comments.length; i++) {
                    this.article.comments[i].replyVisible = false
                    this.article.comments[i].editReplyVisible = false
                }
                this.parentCommentID = 0
                this.replyArticle = true
                this.formData.content = ''
            },
            onEditOrSubmitReply (comment) {
                if (comment.editReplyVisible) {
                    this.onSubmitEditReply(comment)
                } else {
                    this.onSubmitReply()
                }
            },
            // 编辑回复
            onSubmitEditReply (comment) {
                // 验证交给后台
                if (!this.loading) {
                    this.loading = true
                    request.commentEdit({
                        body: {
                            id: comment.id,
                            sourceID: parseInt(this.$route.params.id),
                            parentID: comment.parentID,
                            content: this.formData.content,
                            sourceName: 'article'
                        }
                    }).then(res => {
                        this.loading = false
                        if (res.errNo === ErrorCode.SUCCESS) {
                            let commentID = comment.id
                            location.href = `/topic/${this.article.id}#reply-${commentID}`
                            setTimeout(() => {
                                location.reload()
                            }, 100)
                        } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                            location.href = '/signin?ref=' + encodeURIComponent(location.href)
                        } else {
                            return Promise.reject(new Error(res.msg))
                        }
                    }).catch(err => {
                        this.loading = false
                        if (err.message) {
                            this.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: err.message
                            })
                        }
                    })
                }
                return false
            },
            // 直接回复，或对回复进行回复
            onSubmitReply () {
                // 验证交给后台
                if (!this.loading) {
                    this.loading = true
                    request.commentCreate({
                        body: {
                            sourceID: parseInt(this.$route.params.id),
                            parentID: this.parentCommentID,
                            content: this.formData.content,
                            sourceName: 'article'
                        }
                    }).then(res => {
                        this.loading = false
                        if (res.errNo === ErrorCode.SUCCESS) {
                            let commentID = res.data.comment.id
                            location.href = `/topic/${this.article.id}#reply-${commentID}`
                            setTimeout(() => {
                                location.reload()
                            }, 100)
                        } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                            location.href = '/signin?ref=' + encodeURIComponent(location.href)
                        } else {
                            return Promise.reject(new Error(res.msg))
                        }
                    }).catch(err => {
                        this.loading = false
                        if (err.message) {
                            this.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: err.message
                            })
                        }
                    })
                }
                return false
            },
            onCommentDelete (id) {
                if (this.loading) {
                    return
                }
                this.loading = true
                let self = this
                this.$Modal.confirm({
                    title: '删除回复',
                    content: '确定要删除这个回复?',
                    onOk () {
                        request.deleteComment({
                            params: {
                                id: id
                            }
                        }).then((res) => {
                            this.loading = false
                            if (res.errNo === ErrorCode.SUCCESS) {
                                location.href = `/topic/${self.article.id}`
                                setTimeout(() => {
                                    location.reload()
                                }, 100)
                            } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                                location.href = '/signin?ref=' + encodeURIComponent(location.href)
                            } else {
                                return Promise.reject(new Error(res.msg))
                            }
                        }).catch(err => {
                            self.loading = false
                            self.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: err.message || err.msg
                            })
                        })
                    },
                    onCancel () {

                    }
                })
            },
            collect () {
                let self = this
                if (!this.user) {
                    location.href = '/signin?ref=' + encodeURIComponent(location.href)
                    return
                }
                if (this.alreadyCollect) {
                    this.$Modal.confirm({
                        title: '取消收藏',
                        content: '确认要取消收藏?',
                        onOk () {
                            request.cancelCollect({
                                params: {
                                    id: self.alreadyCollectID
                                }
                            }).then(res => {
                                if (res.errNo === ErrorCode.SUCCESS) {
                                    self.alreadyCollect = false
                                    self.alreadyCollectID = 0

                                    let collectDirList = self.collectDirList
                                    collectDirList.map(item => {
                                        item.hasCollect = false
                                        item.collects.map(items => {
                                            if (items.sourceID === parseInt(self.$route.params.id) && items.sourceName === 'collect_source_article') {
                                                item.hasCollect = false
                                            }
                                        })
                                    })
                                    self.$Message.success({
                                        duration: config.messageDuration,
                                        closable: true,
                                        content: '已取消收藏'
                                    })
                                } else {
                                    self.$Message.error({
                                        duration: config.messageDuration,
                                        closable: true,
                                        content: res.msg
                                    })
                                }
                            }).catch(err => {
                                self.$Message.error({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: err.message || err.msg
                                })
                            })
                        },
                        cancel () {
                        }
                    })
                    return
                }
                this.hideCreateCollectDir()
            },
            hideCreateCollectDir () {
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
                                this.hideCreateCollectDir()
                            } else {
                                this.$Message.error({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: res.msg
                                })
                            }
                        }).catch(err => {
                            this.loading = false
                            this.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: err.message || err.msg
                            })
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
                        this.alreadyCollect = true
                        this.alreadyCollectID = res.data.id
                    } else {
                        this.$Message.error({
                            duration: config.messageDuration,
                            closable: true,
                            content: res.msg
                        })
                    }
                }).catch(err => {
                    this.loading = false
                    this.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: err.message || err.msg
                    })
                })
            }
        },
        mounted () {
            if (window.location.search && window.location.search.indexOf('pushLink=1') >= 0) {
                var bp = document.createElement('script')
                var curProtocol = window.location.protocol.split(':')[0]
                if (curProtocol === 'https') {
                    bp.src = 'https://zz.bdstatic.com/linksubmit/push.js'
                } else {
                    bp.src = 'http://push.zhanzhang.baidu.com/push.js'
                }
                var s = document.getElementsByTagName('script')[0]
                s.parentNode.insertBefore(bp, s)
            }
            window.hljs.initHighlightingOnLoad()

            setTimeout(() => {
                let hash = location.hash || ''
                if (hash.length > 1) {
                    hash = hash.substring(1)
                }
                let replyDOM = document.getElementById(hash)
                replyDOM && replyDOM.scrollIntoView && replyDOM.scrollIntoView()
            }, 1000)
        },
        filters: {
            getReplyTime: dateTool.getReplyTime,
            entity2HTML: htmlUtil.entity2HTML
        },
        components: {
            'md-editor': Editor,
            'baidu-banner900x110': baiduBanner900x110
        }
    }
</script>

<style>
    @import '../../assets/styles/article/detail.css'
</style>
