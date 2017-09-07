<template>
    <div class="articles-container">
        <div class="article-top">
            <h1>{{user && user.id == currentId ? '我' : '他'}}的回复</h1>
        </div>
        <template v-if="comments.length > 0">
            <div v-for="(comment, index) in comments" class="articles-item" :class="{'articles-item-no': index === 0}">
                <h1 class="articles-title">{{comment.voteName ? comment.voteName : comment.articleName}}</h1>
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
            return {}
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
        }
    }
</script>
