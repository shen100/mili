<template>
    <Row>
        <h1 class="crawler-title">爬虫账号</h1>
        <Row>
            <Table class="admin-common-line" :columns="columns" :data="userList"/>
        </Row>
        <Row>
            <Button v-if="!hasUser" type="primary" @click="onSubmit">创建爬虫账号</Button>
        </Row>
    </Row>
</template>

<script>
    import ErrorCode from '~/constant/ErrorCode'
    import request from '~/net/request'
    import UserStatus from '~/constant/UserStatus'
    import config from '~/config'

    export default {
        data () {
            return {
                columns: [
                    {
                        title: 'id',
                        key: 'id'
                    },
                    {
                        title: '用户名',
                        key: 'name'
                    },
                    {
                        title: '邮箱',
                        key: 'email'
                    },
                    {
                        title: '角色',
                        key: 'role',
                        render: (h, obj) => {
                            let role = ''
                            this.role.map(item => {
                                if (obj.row.role === item.value) {
                                    role = item.label
                                }
                            })
                            return role
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, obj) => {
                            switch (obj.row.status) {
                            case UserStatus.STATUS_IN_ACTIVE: return '未激活'
                            case UserStatus.STATUS_ACTIVE: return '已激活'
                            case UserStatus.STATUS_FROZEN: return '已冻结'
                            default: return ''
                            }
                        }
                    }
                ],
                role: [
                    {
                        label: '普通用户',
                        value: 1
                    },
                    {
                        label: '网站编辑',
                        value: 2
                    },
                    {
                        label: '管理员',
                        value: 3
                    },
                    {
                        label: '超级管理员',
                        value: 4
                    },
                    {
                        label: '爬虫管理员',
                        value: 5
                    }
                ]
            }
        },
        asyncData (context) {
            return request.getCrawlAccount({
                client: context.req
            }).then(res => {
                return {
                    userList: res.data,
                    hasUser: res.data && res.data.length > 0
                }
            })
        },
        methods: {
            onSubmit () {
                var self = this
                request.createCrawlAccount().then(res => {
                    console.log(res, ErrorCode, ErrorCode.SUCCESS)
                    if (res.errNo === ErrorCode.SUCCESS) {
                        self.userList = res.data
                        self.hasUser = res.data && res.data.length > 0
                        self.$Message.success({
                            duration: config.messageDuration,
                            closable: true,
                            content: '爬虫账号创建成功'
                        })
                    } else {
                        self.$Message.error({
                            duration: config.messageDuration,
                            closable: true,
                            content: res.msg
                        })
                    }
                })
            }
        },
        head () {
            return {
                title: '爬虫列表'
            }
        },
        mounted () {
        },
        layout: 'admin'
    }
</script>

<style>
    .crawler-title {
        font-size: 22px;
        margin: 12px 0 12px 0;
    }
</style>
