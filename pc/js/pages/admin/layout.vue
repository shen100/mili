<template>
    <div>
        <Header />
        <div class="main-box">
            <Sidebar />
            <div class="main-content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '~/js/components/admin/common/Header.vue';
import Sidebar from '~/js/components/admin/common/Sidebar.vue';

export default {
    data() {
        return {
            folded: false,
        }
    },
    components: {
        Header,
        Sidebar,
    }
}
</script>

<style lang="scss" scoped>
.main-box {
    display: flex;
}

.main-content {
    flex: 1;
    padding: 20px;
}
</style>

