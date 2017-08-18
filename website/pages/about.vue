<template>
    <div>
        <app-header :user="user" />
        <div class="about-box">
            <div class="about-main">
                <ul class="about-nav">
                    <li><a href="/"><span>首页</span></a></li>
                    <li class="about-nav-sep"><span>/</span></li>
                    <li><span class="about-label">关于</span></li>
                </ul>
                <div class="about-center">
                    <h1 class="about-title">关于golang中文社区</h1>
                    <p class="about-text">golang中文社区是一个提供<em>分享</em>、<em>互动</em>、<em>学习</em>的平台。我们非常欢迎更多的golang爱好者加入。</p>
                    <p class="about-text">目前, golang在国内越来越受欢迎, 但相关社区却比较分散。golang中文社区希望能够打破这种局面, 为广大golang爱好者提供一个<em>统一</em>、<em>简洁</em>、<em>好用</em>的平台。同时, 我们也非常在意大家的使用体验, 对拿不准的功能, 会定期的在<a href="/vote">投票专栏</a>发起投票, 征求大家的意见。</p>
                    <p class="about-text">golang中文社区的所有代码都是<em>开源</em>的, 项目名为<em>golang123</em>, github地址为<a href="https://github.com/shen100/golang123" target="_blank">https://github.com/shen100/golang123</a><br/>golang123的技术架构是前后端分离的, 前端使用vue、iview、node.js、nuxt等技术来开发, 后端使用go、gorm、iris等技术来开发。golang123的技术选型也是超前的, 我们大胆得使用nuxt来做<em>前后端同构渲染</em>。</p>
                    <p class="about-text">最后, golang中文社区希望能够和广大地鼠们一起成长!</p>
                </div>
            </div>
            <app-sidebar :user="user" />
        </div>
        <app-footer />
    </div>
</template>

<script>
    import Vue from 'vue'
    import iview from 'iview'
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import Sidebar from '~/components/Sidebar'

    Vue.use(iview)

    export default {
        data () {
            return {

            }
        },
        asyncData (context) {
            return {
                user: context.user
            }
        },
        head () {
            return {
                title: '关于'
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
    @import '~assets/styles/about.css'
</style>
