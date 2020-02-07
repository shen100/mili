<template>
    <div>
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
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                sites: [
                    {
                        name: 'CNode 社区',
                        url: 'https://cnodejs.org'
                    },
                    {
                        name: 'Ruby China',
                        url: 'https://ruby-china.org/'
                    }
                ]
            }
        },
        asyncData (context) {
            return {
                user: context.user
            }
        },
        head () {
            return {
                title: '友情链接'
            }
        }
    }
</script>

<style>
    @import '../assets/styles/links.css'
</style>
