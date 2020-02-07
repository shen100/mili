<template>
    <Row>
        <Row class="admin-common-line">
            <h2 class="common-title-h">置顶话题</h2>
        </Row>
        <Table class="admin-common-line" :columns="topColumns" :data="topList"/>
        <Row class="admin-common-line" type="flex" justify="space-between" align="middle">
            <Col>
                <h2 class="common-title-h">{{siteTitle}}</h2>
            </Col>
            <Col :span="6" :offset="1">
                <Select :value="cate" @on-change="onSelectChange">
                    <Option v-for="(item, index) in categories" :key="index" :value="item.id">{{item.name}}</Option>
                </Select>
            </Col>
        </Row>
        <Table class="admin-common-line" :columns="columns" :data="list"/>
        <Row v-if="list.length > 0" type="flex" justify="end">
            <span class="ivu-page-total" style="margin-top: 10px;">共 {{totalCount}} 条</span>
            <Page
                class="common-page"
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
    import DateUtil from '~/utils/date'
    import config from '~/config'
    import ErrorCode from '~/constant/ErrorCode'
    import { ArticleStatus } from '~/constant/Article'

    export default {
        props: [
            'categories', 'list', 'totalCount', 'pageNo',
            'pageSize', 'cate', 'topList', 'siteTitle', 'path'
        ],
        data () {
            const self = this
            let topColumns = [
                {
                    title: 'id',
                    key: 'id'
                },
                {
                    title: '话题名称',
                    key: 'name'
                },
                {
                    title: '分类',
                    key: 'categories',
                    render: (h, obj) => {
                        return obj.row.categories[0].name
                    }
                },
                {
                    title: '作者',
                    key: 'user',
                    render: (h, obj) => {
                        return (
                            h('a', {
                                'class': 'article-item-user',
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
                    title: '操作',
                    key: 'id',
                    render: (h, obj) => {
                        return h('Button', {
                            props: {
                                type: 'error'
                            },
                            on: {
                                click: () => {
                                    self.changeTop(obj.row, false)
                                }
                            }
                        }, '取消置顶')
                    }
                }
            ]
            let columns = [
                {
                    title: 'id',
                    key: 'id'
                },
                {
                    title: '话题名称',
                    key: 'name'
                },
                {
                    title: '分类',
                    key: 'categories',
                    render: (h, obj) => {
                        return obj.row.categories[0].name
                    }
                },
                {
                    title: '作者',
                    key: 'user',
                    render: (h, obj) => {
                        return (
                            h('a', {
                                'class': 'article-item-user',
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
                        case ArticleStatus.ArticleVerifySuccess:
                            status = '通过'
                            break
                        case ArticleStatus.ArticleVerifying:
                            status = '审核中'
                            break
                        case ArticleStatus.ArticleVerifyFail:
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
                                        'on-change': self.onTableSelectChange
                                    }
                                }, [
                                    h('Option', {
                                        key: ArticleStatus.ArticleVerifySuccess,
                                        props: {
                                            'value': ArticleStatus.ArticleVerifySuccess
                                        }
                                    }, '通过'),
                                    h('Option', {
                                        key: ArticleStatus.ArticleVerifying,
                                        props: {

                                            'value': ArticleStatus.ArticleVerifying
                                        }
                                    }, '审核中'),
                                    h('Option', {
                                        key: ArticleStatus.ArticleVerifyFail,
                                        props: {
                                            'value': ArticleStatus.ArticleVerifyFail
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
                        return h('Button', {
                            props: {
                                type: 'primary',
                                disabled: obj.row.status === ArticleStatus.ArticleVerifyFail
                            },
                            on: {
                                click: () => {
                                    self.changeTop(obj.row, true)
                                }
                            }
                        }, '置顶')
                    }
                }
            ]
            return {
                tempStatus: ArticleStatus.ArticleVerifyFail,
                topColumns: topColumns,
                columns: columns
            }
        },
        methods: {
            onSelectChange (value) {
                window.location.href = `/admin/topic/${this.path}?cateId=${value}`
            },
            onPageChange (value) {
                window.location.href = `/admin/topic/${this.path}?cateId=${this.cate}&pageNo=${value}`
            },
            onChangeStatusVisible (article) {
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].statusVisible) {
                        this.list[i].statusVisible = false
                    }
                    if (this.list[i].id === article.id) {
                        this.list[i].statusVisible = true
                    }
                }
                this.tempStatus = article.status
            },
            onTableSelectChange (value) {
                this.tempStatus = value
            },
            onChangeStatus (article) {
                console.log(article, this.tempStatus)
                Request.updateArticleStatus({
                    body: {
                        id: article.id,
                        status: this.tempStatus
                    }
                }).then(res => {
                    if (res.errNo === ErrorCode.SUCCESS) {
                        for (let i = 0; i < this.list.length; i++) {
                            if (this.list[i].id === article.id) {
                                this.list[i].status = this.tempStatus
                                this.list[i].statusVisible = false
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
                        content: err.message
                    })
                })
            },
            onCancelChangeStatus (article) {
                article.statusVisible = false
                this.tempStatus = ArticleStatus.ArticleVerifyFail
            },
            changeTop (article, flag) {
                this.$Modal.confirm({
                    title: flag ? '置顶' : '取消置顶',
                    content: flag ? '确定要置顶这个话题?' : '确定要取消置顶?',
                    onOk () {
                        const changeFunc = flag ? Request.setTop : Request.delTop
                        changeFunc({
                            params: {
                                id: article.id
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.SUCCESS) {
                                window.location.reload()
                            } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                                location.href = '/signin?ref=' + encodeURIComponent(location.href)
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
                                content: err.message
                            })
                        })
                    },
                    onCancel () {

                    }
                })
            }
        }
    }
</script>

<style>
    .article-item-user {
        cursor: pointer;
        color: #348eed;
    }

    .article-item-user:hover {
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
