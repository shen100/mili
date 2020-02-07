<template>
    <Row>
        <h1 class="reply-title">{{title}}</h1>
        <Table :columns="columns" :data="theComments"></Table>
        <Row v-if="theTotalCount" type="flex" justify="end">
            <span class="ivu-page-total" style="margin-top: 10px;">共 {{theTotalCount}} 条</span>
            <Page class="common-page"
                :current="thePageNo"
                :page-size="thePageSize"
                :total="theTotalCount"
                @on-change="onPageChange"
                :show-elevator="true"/>
        </Row>
    </Row>
</template>

<script>
    import ErrorCode from '~/constant/ErrorCode'
    import Request from '~/net/request'
    import DateUtil from '~/utils/date'
    import config from '~/config'
    import { CommentStatus } from '~/constant/Comment'

    export default {
        props: ['comments', 'pageNo', 'pageSize', 'totalCount', 'path', 'title'],
        data () {
            let self = this
            return {
                theComments: this.comments,
                thePageNo: this.pageNo,
                thePageSize: this.pageSize,
                theTotalCount: this.totalCount,
                tempStatus: CommentStatus.CommentVerifyFail,

                columns: [
                    {
                        title: 'id',
                        key: 'id'
                    },
                    {
                        title: '内容',
                        key: 'content',
                        render: (h, obj) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: obj.row.htmlContent
                                }
                            })
                        }
                    },
                    {
                        title: '作者',
                        key: 'user',
                        render: (h, obj) => {
                            return (
                                h('a', {
                                    'class': 'reply-item-user',
                                    attrs: {
                                        href: '/user/' + obj.row.user.id,
                                        target: '_blank'
                                    }
                                }, obj.row.user.name)
                            )
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
                    },
                    {
                        title: '审核状态',
                        key: 'status',
                        width: 240,
                        render: (h, obj) => {
                            let status = ''
                            switch (obj.row.status) {
                            case CommentStatus.CommentVerifySuccess:
                                status = '通过'
                                break
                            case CommentStatus.CommentVerifying:
                                status = '审核中'
                                break
                            case CommentStatus.CommentVerifyFail:
                                status = '未通过'
                                break
                            default:
                                status = ''
                            }
                            if (obj.row.statusVisible) {
                                return h('div', {
                                    style: {
                                        'font-size': 0
                                    }
                                }, [
                                    h('Select', {
                                        'class': {
                                            'status-edit-select': true
                                        },
                                        props: {
                                            'value': self.tempStatus
                                        },
                                        on: {
                                            'on-change': self.onStatusSelectChange
                                        }
                                    }, [
                                        h('Option', {
                                            key: CommentStatus.CommentVerifySuccess,
                                            props: {
                                                'value': CommentStatus.CommentVerifySuccess
                                            }
                                        }, '通过'),
                                        h('Option', {
                                            key: CommentStatus.CommentVerifying,
                                            props: {
                                                'value': CommentStatus.CommentVerifying
                                            }
                                        }, '审核中'),
                                        h('Option', {
                                            key: CommentStatus.CommentVerifyFail,
                                            props: {
                                                'value': CommentStatus.CommentVerifyFail
                                            }
                                        }, '未通过')
                                    ]),
                                    h('Button', {
                                        'class': {
                                            'status-edit-btn': true
                                        },
                                        props: {
                                            type: 'primary'
                                        },
                                        on: {
                                            click: self.onChangeStatus.bind(self, obj.row)
                                        }
                                    }, '确定'),
                                    h('Button', {
                                        on: {
                                            click: self.onCancelChangeStatus.bind(self, obj.row)
                                        }
                                    }, '取消')
                                ])
                            }
                            return h('div', {}, [
                                h('span', {
                                    style: {
                                        width: '50px',
                                        display: 'inline-block'
                                    }
                                }, status),
                                h('span',
                                    {
                                        'class': {
                                            'status-edit-box': true
                                        },
                                        on: {
                                            click: self.onChangeStatusVisible.bind(self, obj.row)
                                        }
                                    },
                                    [
                                        h('Icon', {
                                            'class': {
                                                'status-edit-icon': true
                                            },
                                            props: {
                                                type: 'edit'
                                            }
                                        }),
                                        h('span', {
                                            'class': {
                                                'status-edit-text': true
                                            }
                                        }, '编辑')
                                    ]
                                )
                            ])
                        }
                    },
                    {
                        title: '操作',
                        key: 'id',
                        render: (h, obj) => {
                            let path = obj.row.sourceName
                            if (path === 'article') {
                                path = 'topic'
                            }
                            return (
                                h('a', {
                                    'class': 'reply-view',
                                    attrs: {
                                        href: `/${path}/${obj.row.sourceID}/#reply-${obj.row.id}`,
                                        target: '_blank'
                                    }
                                }, '查看')
                            )
                        }
                    }
                ]
            }
        },
        methods: {
            onChangeStatusVisible (comment) {
                console.log(comment)
                for (let i = 0; i < this.theComments.length; i++) {
                    if (this.theComments[i].statusVisible) {
                        this.theComments[i].statusVisible = false
                    }
                    if (this.theComments[i].id === comment.id) {
                        this.theComments[i].statusVisible = true
                    }
                }
                this.tempStatus = comment.status
            },
            onStatusSelectChange (value) {
                this.tempStatus = value
            },
            onChangeStatus (comment) {
                Request.updateCommentStatus({
                    params: {
                        id: comment.id
                    },
                    body: {
                        status: this.tempStatus
                    }
                }).then(res => {
                    if (res.errNo === ErrorCode.SUCCESS) {
                        for (let i = 0; i < this.theComments.length; i++) {
                            if (this.theComments[i].id === comment.id) {
                                this.theComments[i].status = this.tempStatus
                                this.theComments[i].statusVisible = false
                            }
                        }
                        this.$Message.success({
                            duration: config.messageDuration,
                            closable: true,
                            content: '操作成功'
                        })
                    } else {
                        this.$Message.error({
                            duration: config.messageDuration,
                            closable: true,
                            content: res.msg
                        })
                    }
                }).catch(err => {
                    this.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: err.message || err.msg
                    })
                })
            },
            onCancelChangeStatus (comment) {
                comment.statusVisible = false
                this.tempStatus = CommentStatus.CommentVerifyFail
            },
            onPageChange (pageNo) {
                let self = this
                const now = new Date()
                const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
                const yesterdayTime = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).getTime()
                const todayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
                let query = {
                    pageNo: pageNo
                }
                if (this.path === 'yesterday') {
                    query.startAt = yesterdayTime
                    query.endAt = todayTime
                } else if (this.path === 'today') {
                    query.startAt = todayTime
                }
                Request.getComments({
                    query: query
                }).then(res => {
                    if (res.errNo === ErrorCode.ERROR) {
                        self.$Message.error(res.msg)
                    } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                        location.href = '/signin?ref=' + encodeURIComponent(location.href)
                    } else if (res.errNo === ErrorCode.SUCCESS) {
                        self.theComments = res.data.comments
                        self.thePageNo = res.data.pageNo
                        self.thePageSize = res.data.pageSize
                        self.theTotalCount = res.data.totalCount
                    }
                }).catch(err => {
                    self.$Message.error(err.msg || err.message)
                })
            }
        }
    }
</script>

<style>
    .reply-view {
        color: #348eed;
    }

    .reply-view:hover {
        color: #348eed;
    }

    .reply-title {
        font-size: 22px;
        margin: 12px 0 12px 0;
    }

    .reply-item-user {
        cursor: pointer;
        color: #348eed;
    }

    .reply-item-user:hover {
        color: #348eed;
    }

    .status-edit-box {
        cursor: pointer;
        color: #348eed;
        margin-left: 8px;
    }

    .status-edit-icon {
        margin-right: 2px;
    }

    .status-edit-select {
        width: 80px;
    }

    .status-edit-btn {
        margin-left: 6px;
        margin-right: 6px;
    }
</style>
