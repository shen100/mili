<template>
    <Row>
        <user-list
            :list="list"
            :totalCount="totalCount"
            :pageNo="pageNo"
            :pageSize="pageSize"
            :siteTitle="'昨日注册用户'"
            :path="'yesterday'"
            :role="role"/>
    </Row>
</template>

<script>
    import request from '~/net/request'
    import UserList from '~/components/admin/UserList'

    export default {
        asyncData (context) {
            const now = new Date()
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
            const query = context.query || {}
            const role = parseInt(query.role) || 0
            return request.getAdminUserList({
                client: context.req,
                query: {
                    pageNo: query.pageNo || 1,
                    role: role,
                    startAt: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).getTime(),
                    endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
                }
            }).then(res => {
                return {
                    list: res.data.users || [],
                    totalCount: res.data.totalCount,
                    pageNo: res.data.pageNo,
                    pageSize: res.data.pageSize,
                    role: role
                }
            })
        },
        head () {
            return {
                title: '昨日注册用户'
            }
        },
        mounted () {
        },
        components: {
            'user-list': UserList
        },
        layout: 'admin'
    }
</script>
