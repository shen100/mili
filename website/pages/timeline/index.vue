<template>
    <div>
        <app-header :user="user"/>
        <div class="timeline-box">
            <h1 class="timeline-title">Golang中文社区成长历史</h1>
            <div>
                <ul>
                    <li v-for="(item, index) in list">
                        <div v-if="index == 0 || list[index].year != list[index - 1].year" class="timeline-item">
                            <div class="timeline-item-year">
                                <div>{{item.date | formatYear}}</div>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-item-content">
                                <div class="timeline-item-line">
                                    <div class="timeline-item-circle"></div>
                                </div>
                                <div class="timeline-item-bubble" :class="[index % 2 == 0 ? 'timeline-item-bubble-even' : 'timeline-item-bubble-odd']">
                                    <p class="timeline-item-title">{{item.name}}</p>
                                    <p class="timeline-item-time"><Icon type="ios-clock-outline"></Icon><span class="timeline-item-time-text">{{item.date | formatDate}}</span></p>
                                    <div class="timeline-item-editor" v-html="item.content"></div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <app-footer />
    </div>
</template>

<script>
    import vue from 'vue'
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import iview from 'iview'

    vue.use(iview)

    export default {
        data () {
            return {
                list: [
                    {
                        name: '支持投票功能',
                        date: {
                            year: 2017,
                            month: 8,
                            date: 20
                        },
                        content: '对拿不准的功能, 会定期在&nbsp;<a href="/vote" target="_blank">投票专栏</a>&nbsp;发起投票, 征求大家的意见'
                    },
                    {
                        name: '架构调整，支持前后端同构渲染',
                        date: {
                            year: 2017,
                            month: 8,
                            date: 9
                        },
                        content: '基于nuxt框架，支持前后端同构渲染'
                    },
                    {
                        name: '集成 Markdown 编辑器',
                        date: {
                            year: 2017,
                            month: 7,
                            date: 28
                        },
                        content: '集成 Markdown 编辑器，支持图片上传、表格、全屏模式'
                    },
                    {
                        name: 'golang123首次提交代码',
                        date: {
                            year: 2017,
                            month: 7,
                            date: 21
                        },
                        content: '代码地址: <a href="https://github.com/shen100/golang123" target="_blank">https://github.com/shen100/golang123</a>'
                    }
                ]
            }
        },
        asyncData (context) {
            const user = context.user
            return {
                user: user
            }
        },
        head () {
            return {
                title: 'Golang中文社区成长历史'
            }
        },
        mounted () {
        },
        filters: {
            formatYear (date) {
                return '' + date.year
            },
            formatDate (date) {
                let year = date.year
                let month = date.month
                let d = date.date
                if (month < 10) {
                    month = '0' + month
                }
                if (d < 10) {
                    d = '0' + d
                }
                return '' + year + '-' + month + '-' + d
            }
        },
        middleware: 'userInfo',
        components: {
            'app-header': Header,
            'app-footer': Footer
        }
    }
</script>

<style>
@import '~assets/styles/timeline/timeline.css'
</style>
