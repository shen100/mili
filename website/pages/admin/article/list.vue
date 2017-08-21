<template>
    <Row>
        <h1 class="admin-common-line">文章列表</h1>
        <Row class="admin-common-line" type="flex" justify="end">
            <Col>
                <router-link to="/admin/article/add">
                    <Button type="primary">新增</Button>
                </router-link>
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
    </Row>
</template>

<script>
    import Request from '~/net/request'
    import moment from 'moment'
    import ErrorCode from '~/constant/ErrorCode'
    // 分类管理
    // 2 审核通过
    // 1 审核中
    // 3 审核未通过
    export default {
        data () {
            return {
                column: [
                    {
                        title: '文章名称',
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
                            case 1:
                                return '审核通过'
                            case 2:
                                return '审核中'
                            default:
                                return '审核未通过'
                            }
                        }
                    },
                    {
                        title: '审核',
                        key: 'id',
                        render: (h, obj) => {
                            return h('Row', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.changeStatus(obj.row.id, 2)
                                        }
                                    }
                                }, '通过'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.changeStatus(obj.row.id, 3)
                                        }
                                    }
                                }, '不通过')
                            ])
                        }
                    },
                    {
                        title: '操作',
                        key: 'id',
                        render: (h, obj) => {
                            const id = obj.row.id
                            let status = true
                            this.topList.map(item => {
                                if (item.id === id) {
                                    status = false
                                }
                            })
                            return h('Button', {
                                props: {
                                    type: status ? 'primary' : 'error',
                                    size: 'small'
                                },
                                style: {
                                    width: '60px',
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.changeTop(obj.row.id, status)
                                    }
                                }
                            }, status ? '置顶' : '取消置顶')
                        }
                    }
                ]
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
                        cateId: query.cateId || ''
                    }
                }),
                Request.getTopList({
                    client: context.req
                })
            ]).then(arr => {
                let select = arr[0].data.categories || []
                let list = arr[1].data.articles || []
                let topList = arr[2].data.articles || []
                console.log(topList)
                select.unshift({
                    id: 0,
                    name: '全部'
                })
                let selectIndex = 0
                select.map(item => {
                    if (item.id === parseInt(query.cateId)) {
                        selectIndex = item.id
                    }
                })

                return {
                    select: select,
                    list: list,
                    selectIndex: selectIndex,
                    topList: topList
                }
            }).catch(err => {
                console.log(err)
                context.error({ message: 'Not Found', statusCode: 404 })
            })
        },
        layout: 'admin',
        middleware: 'userRequired',
        head () {
            return {
                title: '文章管理'
            }
        },
        mounted () {
            console.log(this.list)
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
                        this.list.map((item, index) => {
                            if (item.id === res.id) {
                                item.status = res.status
                            }
                        })
                    } else {

                    }
                }).catch(err => {
                    this.$Message.error(err.message)
                })
            },
            onSelectChange (value) {
                window.location.href = `/admin/article/list?cateId=${value}`
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