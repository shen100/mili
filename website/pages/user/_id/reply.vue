<template>
    <div class="articles-container">
        <div class="article-top">
            <div>{{user && user.id == this.currentId ? '我' : (sex ? '她' : '他')}}的回复</div>
        </div>
        <template v-if="comments.length > 0">
            <div v-for="(comment, index) in comments" class="articles-item" :class="{'articles-item-no': index === 0}">
                <h2 class="articles-title">
                    <a v-if="!comment.noSource" :href="comment.voteID ? `/vote/${comment.voteID}#reply-${comment.id}` : `/topic/${comment.articleID}#reply-${comment.id}`" target="_blank">{{comment.voteName ? comment.voteName : comment.articleName}}</a>
                    <span v-else class="reply-no-source">{{comment.sourceName === 'vote' ? '原投票已被作者删除' : '原话题已被作者删除'}}</span>
                </h2>
                <p class="articles-user-info">
                    <img class="articles-user-info-img" :src="comment.user.avatarURL" alt="">
                    <a class="articles-user-info-name">{{comment.user.name}}</a>
                </p>
                <div class="golang123-digest" v-html="comment.htmlContent"></div>
            </div>
            <div style="text-align: center;">
                <Page class="common-page"
                    :current="pageNo"
                    :page-size="pageSize"
                    :total="totalCount"
                    @on-change="onPageChange"
                    :show-elevator="true"/>
            </div>
        </template>
        <div v-else class="articles-item-empty">
            还没有过回复
        </div>
    </div>
</template>

<script>
    import trimHtml from 'trim-html'
    import request from '~/net/request'
    import htmlUtil from '~/utils/html'

    export default {
        data () {
            return {
                sex: 0
            }
        },
        asyncData (context) {
            return request.getMineComment({
                client: context.req,
                params: {
                    userID: context.params.id
                },
                query: {
                    orderType: 1,
                    desc: 1,
                    pageNo: context.query.pageNo || 1,
                    pageSize: 20
                }
            }).then(res => {
                let comments = res.data.comments || []
                for (let i = 0; i < comments.length; i++) {
                    let sourceName = 'topic'
                    let theID = comments[i].articleID
                    if (comments[i].sourceName === 'vote') {
                        sourceName = 'vote'
                        theID = comments[i].voteID
                    }
                    let limit = 100
                    let more = `...&nbsp;&nbsp;<a href="/${sourceName}/${theID}/#reply-${comments[i].id}" target="_blank"  class="golang123-digest-continue">继续阅读»</a>`

                    // 即没有articleID, 又没有voteID，说明原话题或原投票被删除
                    let noSource = !comments[i].articleID && !comments[i].voteID
                    comments[i].noSource = noSource
                    let trimObj = trimHtml(comments[i].htmlContent, {
                        limit: limit,
                        suffix: !noSource ? more : '',
                        moreLink: false
                    })
                    let content = trimObj.html
                    content = htmlUtil.trimImg(content)
                    if (!trimObj.more) {
                        let newTrimObj = trimHtml(comments[i].htmlContent, {
                            limit: limit,
                            preserveTags: false
                        })
                        content = newTrimObj.html + (!noSource ? more : '')
                    }
                    comments[i].htmlContent = content
                }
                return {
                    userId: context.params.id,
                    pageNo: res.data.pageNo,
                    pageSize: res.data.pageSize,
                    totalCount: res.data.totalCount,
                    comments: comments,
                    user: context.user,
                    currentId: context.params.id
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        mounted () {
            this.$data.sex = this.$parent.currentUser.sex
        },
        methods: {
            onPageChange (value) {
                let userId = this.userId
                window.location.href = `/user/${userId}/reply?pageNo=${value}`
            }
        }
    }
</script>
