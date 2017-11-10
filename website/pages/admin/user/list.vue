<template>
    <Row>
        <h1 class="admin-common-line">用户列表</h1>
        <Row class="admin-common-line" type="flex" justify="end">
            <Col :span="6" :offset="1">
                <Select :value="roleIndex" @on-change="onSelectChange">
                    <Option v-for="(item, index) in role" :key="index" :value="item.value">{{item.label}}</Option>
                </Select>
            </Col>
        </Row>
        <Table
            class="admin-common-line"
            :columns="column"
            :data="userList"/>
    </Row>
</template>

<script>
    import request from '~/net/request'
    import UserStatus from '~/constant/UserStatus'

    export default {
        data () {
            return {
                column: [
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
                roleIndex: 0,
                role: [
                    {
                        label: '全部',
                        value: 0
                    },
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
                    }
                ]
            }
        },
        asyncData (context) {
            return request.getAdminUserList({
                client: context.req
            }).then(res => {
                return {
                    userList: res.data.users
                }
            })
        },
        methods: {
            onSelectChange (value) {
                console.log(value)
            }
        },
        head () {
            return {
                title: '用户列表'
            }
        },
        mounted () {
        },
        layout: 'admin',
        middleware: 'adminRequired'
    }
</script>
