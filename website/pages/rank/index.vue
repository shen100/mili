<template>
    <div>
        <app-header :user="user" />
        <div class="common-body-box">
            <div class="common-body-main">
                <ul class="common-body-nav">
                    <li><a href="/"><span>主页</span></a></li>
                    <li class="common-body-nav-sep"><span>/</span></li>
                    <li><span class="publish-label">注册</span></li>
                </ul>
            </div>
            <div class="rank-container">
                <Table
                    class="rank-list"
                    :rowClassName="rowClassName"
                    :data="topList"
                    :columns="columns"/>
            </div>
        </div>
        <app-footer />
    </div>
</template>

<script>
    import request from '~/net/request'
    import Header from '~/components/Header'
    import ErrorCode from '~/constant/ErrorCode'
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
                        title: '文章数',
                        key: 'articleCount'
                    },
                    {
                        title: '关注数',
                        key: 'collectCount'
                    }
                ]
            }
        },
        asyncData (context) {
            return request.getTop100({
                client: context.req
            }).then(res => {
                if (res.errNo === ErrorCode.SUCCESS) {
                    let topList = res.data.users || []
                    topList.map((item, index) => {
                        item.index = index + 1
                    })
                    return {
                        user: context.user,
                        topList: topList
                    }
                } else {
                    context.error({ statusCode: 404, message: 'Page not found' })
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
            'app-footer': Footer
        }
    }
</script>

<style>
    @import '~assets/styles/rank/index.css'
</style>