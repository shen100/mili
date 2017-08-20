<template>
    <div>
        <app-header :user="user" />
        <div class="golang-home-body">
            <div class="golang-home-body-left">
                <div class="home-categoties-box">
                    <a href="/vote" class="categoties-item" :class="{'categoties-select': !status}">全部</a>
                    <a class="categoties-item" :href="'/vote?status=' + voteStatus.VoteUnderway" :class="{'categoties-select': status == voteStatus.VoteUnderway}">进行中</a>
                    <a class="categoties-item" :href="'/vote?status=' + voteStatus.VoteOver" :class="{'categoties-select': status == voteStatus.VoteOver}">已结束</a>
                </div>
                <div class="home-articles-box">
                    <div v-for="vote in votes" class="articles-cell">
                        <a class="user-icon-box"><img :src="vote.user.avatarURL" alt=""></a>
                        <span class="home-tip-container">
                            <Tooltip :content="`回复数${vote.commentCount}　浏览数${vote.browseCount}`" placement="bottom-start" class="home-tip-box">
                                <a :href="'/vote/' + vote.id" class="no-underline">
                                    <span class="articles-click-num">{{vote.commentCount}}</span>
                                    <span class="articles-num-split">/</span>
                                    <span class="articles-res-num">{{vote.browseCount}}</span>
                                </a>
                            </Tooltip>
                        </span>
                        <a :href="'/vote/' + vote.id" class="home-articles-title">{{vote.name}}</a>
                        <p class="articles-res-time">{{vote.createdAt | getReplyTime}}</p>
                        <a class="user-small-icon-box"><img :src="vote.lastUser.avatarURL" alt=""></a>
                    </div>
                </div>
            </div>
            <app-sidebar :score="score" :votesMaxBrowse="votesMaxBrowse" :votesMaxComment="votesMaxComment"/>
        </div>
        <app-footer />
    </div>
</template>

<script>
    import Vue from 'vue'
    import iview from 'iview'
    import request from '~/net/request'
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import Sidebar from '~/components/Sidebar'
    import dateTool from '~/utils/date'
    import voteStatus from '~/constant/voteStatus'

    Vue.use(iview)

    export default {
        data () {
            return {
                voteStatus: voteStatus
            }
        },
        asyncData (context) {
            const query = context.query || {}
            return Promise.all([
                request.getVotes({
                    client: context.req,
                    query: query
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
                let votes = arr[0].data.votes
                let votesMaxBrowse = arr[1].data.votes
                let votesMaxComment = arr[2].data.votes
                let score = arr[3].data.users
                return {
                    user: context.user,
                    votes: votes,
                    votesMaxBrowse: votesMaxBrowse,
                    votesMaxComment: votesMaxComment,
                    score: score,
                    status: query.status || ''
                }
            }).catch(err => {
                console.log(err)
                context.error({ message: 'Not Found', statusCode: 404 })
            })
        },
        head () {
            return {
                title: '投票'
            }
        },
        middleware: 'userInfo',
        mounted () {
            console.log(this.votes)
        },
        filters: {
            getReplyTime: dateTool.getReplyTime
        },
        components: {
            'app-header': Header,
            'app-footer': Footer,
            'app-sidebar': Sidebar
        }
    }
</script>

<style>
    @import '~assets/styles/vote/list.css'
</style>
