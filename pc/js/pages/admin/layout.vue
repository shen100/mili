<template>
    <div class="admin-main-box">
        <Sidebar ref="sidebar" />
        <div class="admin-right-box">
            <Header @collapsedChange="onCollapsedChange" />
            <div class="admin-content-box">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '~/js/components/admin/common/Header.vue';
import Sidebar from '~/js/components/admin/common/Sidebar.vue';
import { addClass } from '~/js/utils/dom.js';

export default {
    data() {
        return {
        }
    },
    mounted() {
        addClass(document.getElementsByTagName('body')[0], 'admin-body');
    },
    methods: {
        onCollapsedChange() {
            this.$refs.sidebar.toggleCollapse();
        }
    },
    components: {
        Header,
        Sidebar,
    }
}
</script>

<style lang="scss" scoped>
.admin-main-box {
    display: flex;
    height: 100%;
}

.admin-right-box {
    flex-grow: 1;
    overflow-x: hidden;
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.admin-right-box-collapsed {
    margin-left: 0;
}

.sidebar-collapsed {
    width: 50px;
}

.admin-content-box {
    padding: 20px;
    background: #f6f7f9;
    flex: 1;
    overflow-y: auto;
}
</style>
