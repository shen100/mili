<template>
    <Row>
        <reply-list :comments="comments" :pageNo="pageNo" :pageSize="pageSize" :totalCount="totalCount" path="today" title="今日回复"/>
    </Row>
</template>

<script>
    import Request from '~/net/request'
    import ReplyList from '~/components/admin/ReplyList'

    export default {
        asyncData (context) {
            const now = new Date()
            return Request.getComments({
                client: context.req,
                query: {
                    pageNo: 1,
                    startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
                }
            }).then(res => {
                let comments = res.data.comments || []
                for (let i = 0; i < comments.length; i++) {
                    comments[i].statusVisible = false
                }
                return {
                    comments: comments,
                    pageNo: res.data.pageNo,
                    pageSize: res.data.pageSize,
                    totalCount: res.data.totalCount
                }
            }).catch(err => {
                console.log(err)
                context.error({ message: 'Not Found', statusCode: 404 })
            })
        },
        head () {
            return {
                title: '今日回复'
            }
        },
        components: {
            'reply-list': ReplyList
        },
        layout: 'admin'
    }
</script>
