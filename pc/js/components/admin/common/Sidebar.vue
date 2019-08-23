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
            <router-link to="/admin/pushLink">
                <MenuItem name="/admin/pushLink">提交链接</MenuItem>
            </router-link>
        </Submenu>
        <Submenu name="category">
            <template slot="title">
                <Icon type="folder"></Icon>
                分类管理
            </template>
            <router-link to="/admin/category/topic">
                <MenuItem name="/admin/category/topic">话题分类</MenuItem>
            </router-link>
            <router-link to="/admin/category/book">
                <MenuItem name="/admin/category/book">图书分类</MenuItem>
            </router-link>
        </Submenu>
        <Submenu name="topic">
            <template slot="title">
                <Icon type="ios-paper"></Icon>
                文章管理
            </template>
            <router-link to="/admin/topic/list">
                <MenuItem name="/admin/topic/list">全部文章</MenuItem>
            </router-link>
        </Submenu>
        <Submenu name="reply">
            <template slot="title">
                <Icon type="chatboxes"></Icon>
                回复管理
            </template>
            <router-link to="/admin/reply/list">
                <MenuItem name="/admin/reply/list">全部回复</MenuItem>
            </router-link>
            <router-link to="/admin/reply/today">
                <MenuItem name="/admin/reply/today">今日回复</MenuItem>
            </router-link>
            <router-link to="/admin/reply/yesterday">
                <MenuItem name="/admin/reply/yesterday">昨日回复</MenuItem>
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
        <Submenu name="user">
            <template slot="title">
                <Icon type="ios-people"></Icon>
                用户管理
            </template>
            <router-link to="/admin/user/list">
                <MenuItem name="/admin/user/list">全部用户</MenuItem>
            </router-link>
            <router-link to="/admin/user/today">
                <MenuItem name="/admin/user/today">今日用户</MenuItem>
            </router-link>
            <router-link to="/admin/user/yesterday">
                <MenuItem name="/admin/user/yesterday">昨日用户</MenuItem>
            </router-link>
        </Submenu>
        <Submenu name="craler">
            <template slot="title">
                <Icon type="bug"></Icon>
                爬虫管理
            </template>
            <MenuGroup title="账号">
                <router-link to="/admin/crawl/account">
                    <MenuItem name="/admin/crawl/account">爬虫账号</MenuItem>
                </router-link>
            </MenuGroup>
            <MenuGroup title="网站">
                <router-link to="/admin/crawl/jianshu">
                    <MenuItem name="/admin/crawl/jianshu">简书</MenuItem>
                </router-link>
                <router-link to="/admin/crawl/zhihu">
                    <MenuItem name="/admin/crawl/zhihu">知乎</MenuItem>
                </router-link>
                <router-link to="/admin/crawl/huxiu">
                    <MenuItem name="/admin/crawl/huxiu">虎嗅</MenuItem>
                </router-link>
                <router-link to="/admin/crawl/custom">
                    <MenuItem name="/admin/crawl/custom">自定义抓取</MenuItem>
                </router-link>
            </MenuGroup>
        </Submenu>

        <Submenu name="user">
            <template slot="title">
                <Icon type="gear-b"></Icon>
                设置
            </template>
            <router-link to="/admin/settings/site">
                <MenuItem name="/admin/settings/site">网站设置</MenuItem>
            </router-link>
            <router-link to="/admin/settings/baiduad">
                <MenuItem name="/admin/settings/baiduad">百度广告设置</MenuItem>
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
