<template>
    <div>
        <app-header :user="user" />
        <div class="common-body-box">
            <div class="common-body-main">
                <ul class="common-body-nav">
                    <li><a href="/"><span>主页</span></a></li>
                    <li class="common-body-nav-sep"><span>/</span></li>
                    <li><span class="top100-label">Top 100 积分榜</span></li>
                </ul>
                <div class="rank-container">
                    <Table
                        class="rank-list"
                        :rowClassName="rowClassName"
                        :data="topList"
                        :columns="columns"/>
                </div>
            </div>
            <app-sidebar :score="score" :user="user" :userLoginVisible="true" :maxComment="maxComment" :pubTopic="true" :maxBrowse="maxBrowse"/>
        </div>
        <app-footer />
    </div>
</template>

<script>
    import request from '~/net/request'
    import Header from '~/components/Header'
    import Sidebar from '~/components/Sidebar'
    import Footer from '~/components/Footer'

    export default {
        data () {
            return {
                columns: [
                    {
                        title: '#',
                        key: 'index'
                    },
                    {
                        title: '用户名',
                        key: 'name',
                        render: (h, obj) => {
                            return h('a', {
                                class: 'rank-line-list-link',
                                attrs: {
                                    href: `/user/${obj.row.id}`
                                }
                            }, [
                                h('img', {
                                    class: 'rank-line-list-img',
                                    attrs: {
                                        src: obj.row.avatarURL
                                    }
                                }),
                                h('span', {
                                    class: 'rank-line-list'
                                }, obj.row.name)
                            ])
                        }
                    },
                    {
                        title: '积分',
                        key: 'score'
                    },
                    {
                        title: '话题数',
                        key: 'articleCount'
                    },
                    {
                        title: '回复数',
                        key: 'commentCount'
                    }
                ]
            }
        },
        asyncData (context) {
            return Promise.all([
                request.getTop10({
                    client: context.req
                }),
                request.getMaxComment({
                    client: context.req
                }),
                request.getMaxBrowse({
                    client: context.req
                }),
                request.getTop100({
                    client: context.req
                })
            ]).then(data => {
                let user = context.user
                let score = data[0].data.users
                let maxComment = data[1].data.articles || []
                let maxBrowse = data[2].data.articles || []
                let topList = data[3].data.users || []

                topList.map((item, index) => {
                    item.index = index + 1
                })

                return {
                    score: score,
                    user: user,
                    maxComment: maxComment,
                    maxBrowse: maxBrowse,
                    topList: topList
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        middleware: 'userInfo',
        methods: {
            rowClassName: (row, index) => {
                return index % 2 ? '' : 'rank-line-active'
            }
        },
        head () {
            return {
                title: '积分榜'
            }
        },
        components: {
            'app-header': Header,
            'app-footer': Footer,
            'app-sidebar': Sidebar
        }
    }
</script>

<style>
    @import '../../assets/styles/rank/index.css'
</style>
