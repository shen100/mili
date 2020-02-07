<template>
    <div>
        <div class="golang-home-body">
            <div class="golang-home-body-left" style="padding-top: 20px;min-height: 500px;">
                <p v-if="user && user.id == currentUser.id" class="back-container">
                    <a class="top100-link link-left" :href="`/user/${user.id}/collect`">« 去我的收藏</a>
                </p>
                <p v-else class="back-container">
                    <a class="top100-link link-left" :href="`/user/${currentUser.id}/collect`">«  {{currentUser.name}} 的收藏</a>
                    <a class="top100-link link-right" :href="`/user/${user.id}/collect`" v-if="user">去我的收藏 »</a>
                </p>
                <h1 class="collect-line title" style="font-size: 22px;padding-bottom: 20px;">{{folderName}}</h1>
                <div v-for="(collect, index) in collectList" class="articles-item">
                    <h1 class="collect-article-title">
                        <a v-if="!collect.noSource" :href="collect.voteID ? `/vote/${collect.voteID}` : `/topic/${collect.articleID}`" target="_blank">{{collect.voteName ? collect.voteName : collect.articleName}}</a>
                        <span v-else class="collect-no-source">{{collect.sourceName === 'collect_source_vote' ? '原投票已被作者删除' : '原话题已被作者删除'}}</span>
                    </h1>
                    <div class="golang123-digest" v-html="collect.htmlContent"></div>
                </div>
                <div style="text-align: center;">
                    <Page class="common-page"
                        :current="pageNo"
                        :page-size="pageSize"
                        :total="totalCount"
                        @on-change="onPageChange"
                        :show-elevator="true"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import trimHtml from 'trim-html'
    import request from '~/net/request'
    import htmlUtil from '~/utils/html'

    export default {
        data () {
            return {}
        },
        validate ({ params }) {
            var userID = !!params.id
            return userID
        },
        asyncData (context) {
            const query = context.query || {}
            if (!parseInt(query.folder)) {
                return context.error({ statusCode: 404, message: 'Page not found' })
            }
            return Promise.all([
                request.getPublicUser({
                    client: context.req,
                    params: {
                        id: context.params.id
                    }
                }),
                request.collectList({
                    client: context.req,
                    query: {
                        folderID: query.folder,
                        userID: context.params.id,
                        pageNo: query.pageNo || 1,
                        pageSize: 20
                    }
                })
            ]).then(res => {
                let collects = res[1].data.collects || []
                for (let i = 0; i < collects.length; i++) {
                    let sourceName = 'topic'
                    let theID = collects[i].articleID
                    if (collects[i].sourceName === 'collect_source_vote') {
                        sourceName = 'vote'
                        theID = collects[i].voteID
                    }
                    let limit = 100
                    let more = `...&nbsp;&nbsp;<a href="/${sourceName}/${theID}" target="_blank"   class="golang123-digest-continue">继续阅读»</a>`

                    // 即没有articleID, 又没有voteID，说明原话题或原投票被删除
                    let noSource = !collects[i].articleID && !collects[i].voteID
                    collects[i].noSource = noSource
                    let trimObj = trimHtml(collects[i].htmlContent, {
                        limit: limit,
                        suffix: !noSource ? more : '',
                        moreLink: false
                    })
                    let content = trimObj.html
                    content = htmlUtil.trimImg(content)
                    if (!trimObj.more) {
                        let newTrimObj = trimHtml(collects[i].htmlContent, {
                            limit: limit,
                            preserveTags: false
                        })
                        content = newTrimObj.html + (!noSource ? more : '')
                    }
                    collects[i].htmlContent = content
                }
                return {
                    user: context.user, // 登录用户
                    currentUser: res[0].data.user, // 收藏对应的用户
                    collectList: collects,
                    folderID: res[1].data.folderID,
                    folderName: res[1].data.folderName,
                    pageNo: res[1].data.pageNo,
                    pageSize: res[1].data.pageSize,
                    totalCount: res[1].data.totalCount
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        methods: {
            onPageChange (value) {
                let userId = this.currentUser.id
                let folderID = this.folderID
                window.location.href = `/user/collect/${userId}?folder=${folderID}&pageNo=${value}`
            }
        },
        head () {
            return {
                title: '收藏'
            }
        }
    }
</script>

<style>
    @import '../../../assets/styles/mine/index.css';
    @import '../../../assets/styles/user/collectList.css';
</style>
