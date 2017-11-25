<template>
    <Row>
        <h1 class="reply-title">今日回复</h1>
        <Table :columns="columns" :data="comments"></Table>
        <Row style="text-align:right;">
            <Page class="common-page"
                :current="pageNo"
                :page-size="pageSize"
                :total="totalCount"
                @on-change="onPageChange"
                :show-elevator="true"/>
        </Row>
    </Row>
</template>
<script>
    import Request from '~/net/request'
    import ErrorCode from '~/constant/ErrorCode'
    import DateUtil from '~/utils/date'

    export default {
        data () {
            return {
                columns: [
                    {
                        title: '内容',
                        key: 'content',
                        render: (h, obj) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: obj.row.content
                                }
                            })
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'createdAt',
                        render: (h, obj) => {
                            return DateUtil.formatYMDHMS(obj.row.createdAt)
                        }
                    },
                    {
                        title: '更新时间',
                        key: 'updatedAt',
                        render: (h, obj) => {
                            return DateUtil.formatYMDHMS(obj.row.updatedAt)
                        }
                    }
                ]
            }
        },
        asyncData (context) {
            return Request.getTodayComments({
                client: context.req,
                query: {
                    pageNo: 1
                }
            }).then(res => {
                console.log(res)
                return {
                    comments: res.data.comments,
                    pageNo: res.data.pageNo,
                    pageSize: res.data.pageSize,
                    totalCount: res.data.totalCount
                }
            }).catch(err => {
                console.log(err)
                context.error({ message: 'Not Found', statusCode: 404 })
            })
        },
        layout: 'admin',
        middleware: 'adminRequired',
        head () {
            return {
                title: '今日回复'
            }
        },
        methods: {
            onPageChange (pageNo) {
                let self = this
                Request.getTodayComments({
                    query: {
                        pageNo: pageNo
                    }
                }).then(res => {
                    if (res.errNo === ErrorCode.ERROR) {
                        self.$Message.error(res.msg)
                    } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                        location.href = '/signin?ref=' + encodeURIComponent(location.href)
                    } else if (res.errNo === ErrorCode.SUCCESS) {
                        this.comments = res.data.comments
                        this.pageNo = res.data.pageNo
                        this.pageSize = res.data.pageSize
                        this.totalCount = res.data.totalCount
                    }
                }).catch(err => {
                    self.$Message.error(err.msg)
                })
            }
        }
    }
</script>

<style>
    .reply-title {
        font-size: 22px;
        margin: 12px 0 12px 0;
    }
</style>
