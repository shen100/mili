<template>
    <div class="articles-container">
        <div class="article-top">
            <div>{{user && user.id == this.currentId ? '我' : (sex ? '她' : '他')}}参与的投票</div>
        </div>
        <template v-if="votes.length > 0">
            <div v-for="(vote, index) in votes" class="articles-item" :class="{'articles-item-no': index === 0}">
                <h2 class="articles-title"><a :href="`/vote/${vote.id}`" target="_blank">{{vote.name}}</a></h2>
                <div class="golang123-editor" :class="vote.show ? '' : 'articles-hidden'" v-html="vote.content"></div>
                <p class="articles-button">
                    <a :href="`/${'vote/' + vote.id}`" class="no-underline">阅读全文<Icon type="chevron-right"></Icon></a>
                </p>
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
            还没有投票
        </div>
    </div>
</template>

<script>
    import request from '~/net/request'

    export default {
        data () {
            return {
                sex: 0
            }
        },
        asyncData (context) {
            return request.getMineVote({
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
                console.log(res)
                return {
                    userId: context.params.id,
                    pageNo: res.data.pageNo,
                    pageSize: res.data.pageSize,
                    totalCount: res.data.totalCount,
                    votes: res.data.votes || [],
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
                window.location.href = `/user/${userId}/vote?pageNo=${value}`
            }
        }
    }
</script>
