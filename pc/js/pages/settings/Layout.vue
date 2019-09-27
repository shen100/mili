<template>
    <div>
        <nav class="view-nav">
            <ul class="nav-list">
                <li class="nav-item active">
                    <router-link to="/settings/profile" active-class="active">个人资料</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/settings/password" active-class="active">修改密码</router-link>
                </li>
            </ul>
        </nav>
        <div class="route-main-box">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
.route-main-box {
    width: 960px;
    margin: 0 auto;
    margin-top: 125px;
}
</style>