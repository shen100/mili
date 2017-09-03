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
            :data="list"/>
    </Row>
</template>

<script>
    export default {
        data () {
            return {
                column: [
                    {
                        title: '用户名',
                        key: 'name'
                    }
                ],
                list: [],
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
            return {}
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
        layout: 'admin',
        middleware: 'adminRequired'
    }
</script>