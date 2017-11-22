<template>
    <div class="articles-container">
        <div class="article-top">
            <div>{{user && user.id == this.currentId ? '我' : (sex ? '她' : '他')}}的回复</div>
        </div>
        <template v-if="comments.length > 0">
            <div v-for="(comment, index) in comments" class="articles-item" :class="{'articles-item-no': index === 0}">
                <h2 class="articles-title"><a :href="comment.voteID ? `/vote/${comment.voteID}#comment-${comment.id}` : `/topic/${comment.articleID}#comment-${comment.id}`" target="_blank">{{comment.voteName ? comment.voteName : comment.articleName}}</a></h2>
                <div class="golang123-editor" :class="comment.show ? '' : 'articles-hidden'" v-html="comment.content"></div>
                <p class="articles-button">
                    <a :href="`/${comment.voteID ? 'vote/' + comment.voteID : 'topic/' + comment.articleID}`" class="no-underline">阅读全文<Icon type="chevron-right"></Icon></a>
                </p>
            </div>
        </template>
        <div v-else class="articles-item-empty">
            还没有过回复
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
            return request.getMineComment({
                client: context.req,
                params: {
                    userID: context.params.id
                },
                query: {
                    orderType: 1,
                    desc: 1,
                    pageSize: 20
                }
            }).then(res => {
                return {
                    comments: res.data.comments || [],
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
        }
    }
</script>
