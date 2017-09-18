<template>
    <div>
        <app-header :user="user" />
        <div class="links-box">
            <div class="links-main">
                <ul class="links-nav">
                    <li><a href="/"><span>首页</span></a></li>
                    <li class="links-nav-sep"><span>/</span></li>
                    <li><span class="links-label">友情链接</span></li>
                </ul>
                <div class="links-sites">
                    <div class="links-site" v-for="site in sites"><a :href="site.url" target="_blank">{{site.name}}</a></div>
                </div>
            </div>
            <app-sidebar :maxBrowse="maxBrowse"/>
        </div>
        <app-footer />
    </div>
</template>

<script>
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import Sidebar from '~/components/Sidebar'
    import request from '~/net/request'

    export default {
        data () {
            return {
                sites: [
                    {
                        name: 'CNode 社区',
                        url: 'https://cnodejs.org'
                    }
                ]
            }
        },
        asyncData (context) {
            return request.getMaxBrowse({
                client: context.req
            }).then(data => {
                let maxBrowse = data.data.articles
                return {
                    user: context.user,
                    maxBrowse: maxBrowse
                }
            })
        },
        head () {
            return {
                title: '友情链接'
            }
        },
        middleware: 'userInfo',
        components: {
            'app-header': Header,
            'app-footer': Footer,
            'app-sidebar': Sidebar
        }
    }
</script>

<style>
    @import '../assets/styles/links.css'
</style>
