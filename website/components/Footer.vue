<template>
    <div class="golang-footer">
        <div class="golang-footer-page-link">
            <a href="https://github.com/shen100/golang123" target="_blank"><div class="golang-footer-github"><Icon type="social-github" style="margin-right:1px;"></Icon></div><span style="margin-left: 2px;">Github</span></a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <a href="/rank">积分榜</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <!--<a>帮助中心</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <a>服务条款</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span> -->
            <a href="/links">友情链接</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <!-- <a>联系我们</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span> -->
            <a href="/timeline">成长历史</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <a href="/about">关于我们</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <span>{{siteConfig.icp}}</span>
        </div>
        <div class="golang-footer-copyright">
            <span>2017&nbsp;<a href="/">{{siteConfig.name}}</a>&nbsp;©版权所有</span>
            <span>&nbsp;<a href="https://github.com/shen100/golang123">powerd by golang123</a>&nbsp;</span>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                siteConfig: this.$store.state.siteConfig
            }
        }
    }
</script>
