<template>
    <Menu theme="dark" :active-name="activeName" :open-names="openNames">
        <Submenu name="overview">
            <template slot="title">
                <Icon type="stats-bars"></Icon>
                网站概览
            </template>
            <router-link to="/admin">
                <Menu-item name="/admin">网站概览</Menu-item>
            </router-link>
            <router-link to="/admin/pushLink">
                <Menu-item name="/admin/pushLink">提交链接</Menu-item>
            </router-link>
        </Submenu>
        <Submenu name="category">
            <template slot="title">
                <Icon type="folder"></Icon>
                分类管理
            </template>
            <router-link to="/admin/category/topic">
                <Menu-item name="/admin/category/topic">话题分类</Menu-item>
            </router-link>
            <router-link to="/admin/category/book">
                <Menu-item name="/admin/category/book">图书分类</Menu-item>
            </router-link>
        </Submenu>
        <Submenu name="topic">
            <template slot="title">
                <Icon type="ios-paper"></Icon>
                话题管理
            </template>
            <router-link to="/admin/topic/list">
                <Menu-item name="/admin/topic/list">全部话题</Menu-item>
            </router-link>
            <router-link to="/admin/topic/today">
                <Menu-item name="/admin/topic/today">今日话题</Menu-item>
            </router-link>
            <router-link to="/admin/topic/yesterday">
                <Menu-item name="/admin/topic/yesterday">昨日话题</Menu-item>
            </router-link>
        </Submenu>
        <Submenu name="reply">
            <template slot="title">
                <Icon type="chatboxes"></Icon>
                回复管理
            </template>
            <router-link to="/admin/reply/list">
                <Menu-item name="/admin/reply/list">全部回复</Menu-item>
            </router-link>
            <router-link to="/admin/reply/today">
                <Menu-item name="/admin/reply/today">今日回复</Menu-item>
            </router-link>
            <router-link to="/admin/reply/yesterday">
                <Menu-item name="/admin/reply/yesterday">昨日回复</Menu-item>
            </router-link>
        </Submenu>
        <Submenu name="user">
            <template slot="title">
                <Icon type="ios-people"></Icon>
                用户管理
            </template>
            <router-link to="/admin/user/list">
                <Menu-item name="/admin/user/list">全部用户</Menu-item>
            </router-link>
            <router-link to="/admin/user/today">
                <Menu-item name="/admin/user/today">今日用户</Menu-item>
            </router-link>
            <router-link to="/admin/user/yesterday">
                <Menu-item name="/admin/user/yesterday">昨日用户</Menu-item>
            </router-link>
        </Submenu>
        <Submenu name="craler">
            <template slot="title">
                <Icon type="bug"></Icon>
                爬虫管理
            </template>
            <MenuGroup title="账号">
                <router-link to="/admin/crawl/account">
                    <Menu-item name="/admin/crawl/account">爬虫账号</Menu-item>
                </router-link>
            </MenuGroup>
            <MenuGroup title="网站">
                <router-link to="/admin/crawl/jianshu">
                    <Menu-item name="/admin/crawl/jianshu">简书</Menu-item>
                </router-link>
                <router-link to="/admin/crawl/zhihu">
                    <Menu-item name="/admin/crawl/zhihu">知乎</Menu-item>
                </router-link>
                <router-link to="/admin/crawl/huxiu">
                    <Menu-item name="/admin/crawl/huxiu">虎嗅</Menu-item>
                </router-link>
                <router-link to="/admin/crawl/custom">
                    <Menu-item name="/admin/crawl/custom">自定义抓取</Menu-item>
                </router-link>
            </MenuGroup>
        </Submenu>

        <Submenu name="user">
            <template slot="title">
                <Icon type="gear-b"></Icon>
                设置
            </template>
            <router-link to="/admin/settings/site">
                <Menu-item name="/admin/settings/site">网站设置</Menu-item>
            </router-link>
            <router-link to="/admin/settings/baiduad">
                <Menu-item name="/admin/settings/baiduad">百度广告设置</Menu-item>
            </router-link>
        </Submenu>

    </Menu>
</template>

<script>
    export default {
        props: ['activeName'],

        data () {
            return {
                openNames: ['overview', 'category', 'topic', 'reply', 'user', 'craler']
            }
        }
    }
</script>
