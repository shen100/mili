<template>
    <div>
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
    </div>
</template>

<script>
    export default {
        data () {
            return {
                list: [
                    {
                        name: 'golang123 v0.6发布',
                        date: {
                            year: 2018,
                            month: 1,
                            date: 13
                        },
                        content: '1.web框架切换到gin<br/>2.登录验证由session改为jwt<br/>3.使用dep来管理第三方包依赖'
                    },
                    {
                        name: '回复功能',
                        date: {
                            year: 2017,
                            month: 12,
                            date: 30
                        },
                        content: '回复话题或回复投票，同时支持对回复进行回复'
                    },
                    {
                        name: '个人中心',
                        date: {
                            year: 2017,
                            month: 12,
                            date: 18
                        },
                        content: '个人主页、发表的话题、参与的回复、参与的投票、收藏'
                    },
                    {
                        name: '升级后台管理',
                        date: {
                            year: 2017,
                            month: 11,
                            date: 26
                        },
                        content: '后台管理增加话题管理、回复管理'
                    },
                    {
                        name: '话题置顶',
                        date: {
                            year: 2017,
                            month: 10,
                            date: 18
                        },
                        content: '增加话题置顶功能，话题列表支持分页'
                    },
                    {
                        name: 'iris升级',
                        date: {
                            year: 2017,
                            month: 8,
                            date: 28
                        },
                        content: 'golang123升级iris框架到最新版8.4.0'
                    },
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
        }
    }
</script>

<style>
    @import '../../assets/styles/timeline/timeline.css'
</style>
