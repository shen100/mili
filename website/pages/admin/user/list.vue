<template>
    <Row>
        <user-list
            :list="list"
            :totalCount="totalCount"
            :pageNo="pageNo"
            :pageSize="pageSize"
            :siteTitle="'全部用户'"
            :path="'list'"
            :role="role"/>
    </Row>
</template>

<script>
    import request from '~/net/request'
    import UserList from '~/components/admin/UserList'

    export default {
        asyncData (context) {
            const query = context.query || {}
            const role = parseInt(query.role) || 0
            return request.getAdminUserList({
                client: context.req,
                query: {
                    pageNo: query.pageNo || 1,
                    role: role
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
                title: '全部用户'
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
