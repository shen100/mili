<template>
    <Menu theme="dark" :active-name="activeName" :open-names="openNames">
        <Submenu name="overview">
            <template slot="title">
                <Icon type="stats-bars"></Icon>
                网站概览
            </template>
            <router-link to="/admin">
                <MenuItem name="/admin">网站概览</MenuItem>
            </router-link>
        </Submenu>

        <Submenu name="article">
            <template slot="title">
                <Icon type="ios-paper"></Icon>
                文章管理
            </template>
            <router-link to="/article/category">
                <MenuItem name="/article/category">文章分类</MenuItem>
            </router-link>
            <router-link to="/article">
                <MenuItem name="/article">全部文章</MenuItem>
            </router-link>
            <router-link to="/article/tag">
                <MenuItem name="/article/tag">标签</MenuItem>
            </router-link>
        </Submenu>

        <Submenu name="reply">
            <template slot="title">
                <Icon type="chatboxes"></Icon>
                沸点管理
            </template>
            <router-link to="/boilingpoint/list">
                <MenuItem name="/boilingpoint/list">沸点</MenuItem>
            </router-link>
            <router-link to="/boilingpoint/topic">
                <MenuItem name="/boilingpoint/topic">话题</MenuItem>
            </router-link>
        </Submenu>

    </Menu>
</template>

<script>
export default {
    props: ['activeName'],

    data () {
        return {
            openNames: ['overview', 'article', 'reply', 'user', 'craler']
        }
    }
}
</script>
