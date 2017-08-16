<template>
    <div>
        <admin-header />
        <Row class="admin-body">
            <Col :span="5">
                <admin-sidebar class="admin-sidebar-container" />
            </Col>
            <Col class="admin-body-container" :span="18">
                <nuxt/>
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
        components: {
            adminHeader: Header,
            adminSidebar: Sidebar
        }
    }
</script>

<style>
    .admin-sidebar-container, .admin-body-container {
        float: left;
    }
</style>