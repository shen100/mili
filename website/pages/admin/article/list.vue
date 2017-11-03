<template>
    <Row>
        <Row class="admin-common-line">
            <h1 class="common-title-h">置顶话题</h1>
        </Row>
        <Table
            class="admin-common-line"
            :columns="topColumn"
            :data="topList"/>
        <Row class="admin-common-line" type="flex" justify="space-between" align="middle">
            <Col>
                <h1 class="common-title-h">话题列表</h1>
            </Col>
            <Col :span="6" :offset="1">
                <Select :value="selectIndex" @on-change="onSelectChange">
                    <Option v-for="(item, index) in select" :key="index" :value="item.id">{{item.name}}</Option>
                </Select>
            </Col>
        </Row>
        <Table
            class="admin-common-line"
            :columns="column"
            :data="list"/>
        <Row
            v-if="list.length > 0"
            type="flex"
            justify="end">
            <span v-if="totalVisible" class="ivu-page-total" style="margin-top: 10px;">共 {{totalCount}} 条</span>
            <Page
                class="common-page"
                :current="pageNo"
                :page-size="pageSize"
                :total="totalCount"
                @on-change="onPageChange"></Page>
        </Row>
    </Row>
</template>

<script>
    import Request from '~/net/request'
    import moment from 'moment'
    import ErrorCode from '~/constant/ErrorCode'
    import { ArticleStatus } from '~/constant/Article'

    export default {
        data () {
            const self = this
            let column = [
                {
                    title: '话题名称',
                    key: 'name'
                },
                {
                    title: '创建时间',
                    key: 'createdAt',
                    render: (h, obj) => {
                        return moment(obj.row.createdAt).utc().format('YYYY-MM-DD HH:mm:ss')
                    }
                },
                {
                    title: '最近更新',
                    key: 'updatedAt',
                    render: (h, obj) => {
                        return moment(obj.row.updatedAt).utc().format('YYYY-MM-DD HH:mm:ss')
                    }
                },
                {
                    title: '分类',
                    key: 'categories',
                    render: (h, obj) => {
                        return obj.row.categories[0].name
                    }
                },
                {
                    title: '当前状态',
                    key: 'status',
                    render: (h, obj) => {
                        switch (obj.row.status) {
                        case ArticleStatus.ArticleVerifySuccess:
                            return '审核通过'
                        case ArticleStatus.ArticleVerifying:
                            return '审核中'
                        case ArticleStatus.ArticleVerifyFail:
                            return '审核未通过'
                        default:
                            return ''
                        }
                    }
                },
                {
                    title: '审核',
                    key: 'id',
                    render: (h, obj) => {
                        let status = obj.row.status
                        let successBtn = {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    self.changeStatus(obj.row.id, ArticleStatus.ArticleVerifySuccess)
                                }
                            }
                        }
                        let failBtn = {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    self.changeStatus(obj.row.id, ArticleStatus.ArticleVerifyFail)
                                }
                            }
                        }
                        if (status === ArticleStatus.ArticleVerifySuccess) {
                            return h('Row', [
                                h('Button', failBtn, '不通过')
                            ])
                        } else if (status === ArticleStatus.ArticleVerifyFail) {
                            return h('Row', [
                                h('Button', successBtn, '通过')
                            ])
                        } else {
                            return h('Row', [
                                h('Button', successBtn, '通过'),
                                h('Button', failBtn, '不通过')
                            ])
                        }
                    }
                },
                {
                    title: '操作',
                    key: 'id',
                    render: (h, obj) => {
                        const id = obj.row.id
                        return h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                width: '60px',
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    self.changeTop(id, true)
                                }
                            }
                        }, '置顶')
                    }
                }
            ]
            let topColumn = [
                {
                    title: '话题名称',
                    key: 'name'
                },
                {
                    title: '创建时间',
                    key: 'createdAt',
                    render: (h, obj) => {
                        return moment(obj.row.createdAt).utc().format('YYYY-MM-DD HH:mm:ss')
                    }
                },
                {
                    title: '最近更新',
                    key: 'updatedAt',
                    render: (h, obj) => {
                        return moment(obj.row.updatedAt).utc().format('YYYY-MM-DD HH:mm:ss')
                    }
                },
                {
                    title: '分类',
                    key: 'categories'
                },
                {
                    title: '操作',
                    key: 'id',
                    render: (h, obj) => {
                        const id = obj.row.id
                        return h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style: {
                                width: '60px',
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    self.changeTop(id, false)
                                }
                            }
                        }, '取消置顶')
                    }
                }
            ]
            return {
                topColumn: topColumn,
                column: column
            }
        },
        asyncData (context) {
            const query = context.query || {}
            return Promise.all([
                Request.getCategories({
                    client: context.req
                }),
                Request.getAdminArticles({
                    client: context.req,
                    query: {
                        cateId: query.cateId || '',
                        pageNo: query.pageNo || 1
                    }
                }),
                Request.getTopList({
                    client: context.req
                })
            ]).then(arr => {
                let select = arr[0].data.categories || []
                let list = arr[1].data.articles || []
                let pageNo = arr[1].data.pageNo
                let totalCount = arr[1].data.totalCount
                let pageSize = arr[1].data.pageSize
                let topList = arr[2].data.articles || []
                select.unshift({
                    id: 0,
                    name: '全部'
                })
                let selectIndex = 0

                return {
                    totalVisible: process.env.NODE_ENV !== 'production',
                    select: select,
                    list: list,
                    totalCount: totalCount,
                    pageNo: pageNo,
                    pageSize: pageSize,
                    selectIndex: selectIndex,
                    cate: query.cateId || '',
                    topList: topList
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
                title: '文章管理'
            }
        },
        methods: {
            changeStatus (id, status) {
                Request.updateAdminArticles({
                    body: {
                        id: id,
                        status: status
                    }
                }).then(res => {
                    if (res.errNo === ErrorCode.SUCCESS) {
                        this.$Message.success('操作成功')
                        setTimeout(() => window.location.reload(), 500)
                    } else {
                        this.$Message.error(res.msg)
                    }
                }).catch(err => {
                    this.$Message.error(err.message)
                })
            },
            onSelectChange (value) {
                window.location.href = `/admin/article/list?cateId=${value}`
            },
            onPageChange (value) {
                window.location.href = `/admin/article/list?cate=${this.cate}&pageNo=${value}`
            },
            changeTop (id, status) {
                const changeFunc = status ? Request.setTop : Request.delTop
                changeFunc({
                    params: {
                        id: id
                    }
                }).then(res => {
                    if (res.errNo === ErrorCode.SUCCESS) {
                        this.$Message.success('操作成功')
                        window.location.reload()
                    } else {
                        this.$Message.error(res.msg)
                    }
                }).catch(err => {
                    this.$Message.error(err.message)
                })
            }
        }
    }
</script>

<style>

</style>
