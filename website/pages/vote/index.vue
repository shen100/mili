<template>
    <div>
        <div>
            <div class="home-categoties-box">
                <a href="/vote" class="categoties-item" :class="{'categoties-select': !status}">全部</a>
                <a class="categoties-item" :href="'/vote?status=' + voteStatus.VOTE_UNDERWAY" :class="{'categoties-select': status == voteStatus.VOTE_UNDERWAY}">投票中</a>
                <a class="categoties-item" :href="'/vote?status=' + voteStatus.VOTE_OVER" :class="{'categoties-select': status == voteStatus.VOTE_OVER}">已结束</a>
            </div>
            <div class="home-articles-box">
                <div v-for="vote in votes" class="articles-cell">
                    <a class="user-icon-box" :href="`/user/${vote.user.id}`" target="_blank"><img :src="vote.user.avatarURL" alt=""></a>
                    <span class="home-tip-container">
                        <Tooltip :content="`回复数${vote.commentCount}　浏览数${vote.browseCount}`" placement="bottom-start" class="home-tip-box">
                            <a :href="'/vote/' + vote.id" class="no-underline">
                                <span class="articles-click-num">{{vote.commentCount}}</span>
                                <span class="articles-num-split">/</span>
                                <span class="articles-res-num">{{vote.browseCount}}</span>
                            </a>
                        </Tooltip>
                    </span>
                    <a :href="'/vote/' + vote.id" class="home-articles-title">{{vote.name | entity2HTML}}</a>
                    <p class="articles-res-time">{{vote.createdAt | getReplyTime}}</p>
                    <a :href="`/user/${vote.lastUser.id}`" target="_blank" class="user-small-icon-box"><img :src="vote.lastUser.avatarURL" alt=""></a>
                </div>
            </div>
            <baidu-banner900x110 />
        </div>
    </div>
</template>

<script>
    import request from '~/net/request'
    import dateTool from '~/utils/date'
    import VoteStatus from '~/constant/VoteStatus'
    import htmlUtil from '~/utils/html'
    import baiduBanner900x110 from '~/components/ad/baidu/banner900x110'

    export default {
        data () {
            return {
                voteStatus: VoteStatus
            }
        },
        asyncData (context) {
            const query = context.query || {}
            return Promise.all([
                request.getVotes({
                    client: context.req,
                    query: query
                })
            ]).then(arr => {
                let votes = arr[0].data.votes
                return {
                    user: context.user,
                    votes: votes,
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
        filters: {
            getReplyTime: dateTool.getReplyTime,
            entity2HTML: htmlUtil.entity2HTML
        },
        components: {
            'baidu-banner900x110': baiduBanner900x110
        }
    }
</script>

<style>
    @import '../../assets/styles/vote/list.css'
</style>
