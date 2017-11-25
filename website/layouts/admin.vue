<template>
    <div class="admin-root">
        <admin-header />
        <Row class="admin-body">
            <Col :span="5">
                <admin-sidebar :activeName="activeName" class="admin-sidebar-container" />
            </Col>
            <Col class="admin-body-container" :span="18">
                <nuxt ref="content"/>
            </Col>
        </Row>
    </div>
</template>

<script>
    import Vue from 'vue'
    import iview from 'iview'
    import Header from '~/components/admin/Header'
    import Sidebar from '~/components/admin/Sidebar'

    Vue.use(iview)

    export default {
        data () {
            return {
                activeName: ''
            }
        },
        components: {
            adminHeader: Header,
            adminSidebar: Sidebar
        },
        mounted () {
            this.activeName = this.$refs.content.$route.path
        }
    }
</script>

<style>
    .admin-root {
        min-width: 1200px;
    }

    .admin-sidebar-container, .admin-body-container {
        float: left;
    }

</style>
