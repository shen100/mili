<template>
    <Row>
        <h1 class="admin-common-line user-title">{{siteTitle}}</h1>
        <Row class="admin-common-line" type="flex" justify="end">
            <Col :span="6" :offset="1">
                <Select :value="role" @on-change="onSelectChange">
                    <Option v-for="(item, index) in roles" :key="index" :value="item.value">{{item.label}}</Option>
                </Select>
            </Col>
        </Row>
        <Table
            class="admin-common-line"
            :columns="column"
            :data="list"/>
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

<style>
    .user-title {
        font-size: 22px;
        margin: 12px 0;
    }

    .item-user, .item-user:hover {
        cursor: pointer;
        color: #348eed;
    }
</style>

<script>
    import UserStatus from '~/constant/UserStatus'
    import DateUtil from '~/utils/date'

    export default {
        props: [
            'list', 'totalCount', 'pageNo',
            'pageSize', 'siteTitle', 'path', 'role'
        ],
        data () {
            return {
                column: [
                    {
                        title: '用户名',
                        key: 'name',
                        render: (h, obj) => {
                            return (
                                h('a', {
                                    'class': 'item-user',
                                    attrs: {
                                        href: '/user/' + obj.row.id,
                                        target: '_blank'
                                    }
                                }, obj.row.name)
                            )
                        }
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
                            this.roles.map(item => {
                                if (obj.row.role === item.value) {
                                    role = item.label
                                }
                            })
                            return role
                        }
                    },
                    {
                        title: '注册时间',
                        key: 'createdAt',
                        render: (h, obj) => {
                            return DateUtil.formatYMDHMS(obj.row.createdAt)
                        }
                    },
                    {
                        title: '激活时间',
                        key: 'activatedAt',
                        render: (h, obj) => {
                            console.log(obj.row.activatedAt)
                            return (obj.row.activatedAt && DateUtil.formatYMDHMS(obj.row.activatedAt)) || ''
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
                roles: [
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
                        label: '爬虫管理员',
                        value: 5
                    },
                    {
                        label: '超级管理员',
                        value: 4
                    }
                ]
            }
        },
        methods: {
            onSelectChange (value) {
                window.location.href = `/admin/user/${this.path}?role=${value}`
            },
            onPageChange (value) {
                window.location.href = `/admin/user/${this.path}?pageNo=${value}&role=${this.role}`
            }
        }
    }
</script>
