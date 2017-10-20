<template>
    <div>
        <app-header :user="user" />
        <div class="golang-home-body">
            <div class="golang-home-body-left">
                <p v-if="user && user.id == currentUser.id" class="back-container">
                    <a class="top100-link link-left" :href="`/user/${user.id}/collect`">« 去我的收藏</a>
                </p>
                <p v-else class="back-container">
                    <a class="top100-link link-left" :href="`/user/${currentUser.id}/collect`">«  {{currentUser.name}} 的收藏</a>
                    <a class="top100-link link-right" :href="`/user/${user.id}/collect`" v-if="user">去我的收藏 »</a>
                </p>
                <h1 class="collect-line title">{{collects.filter(item => parseInt(folderID) === item.id)[0].name}}</h1>
                <p class="collect-line desc">
                    <a href=""><Icon type="ios-chatbubble-outline"></Icon>添加评论</a>
                    •
                    <a href="">修改记录</a>
                </p>
                <div v-for="(collect, index) in collectList" class="articles-item">
                    <h1 class="articles-title">{{collect.voteName ? collect.voteName : collect.articleName}}</h1>
                    <div class="golang123-editor articles-hidden" v-html="collect.voteID ? collect.voteContent : collect.articleContent"></div>
                    <p class="articles-button">
                        <a :href="`/${collect.voteID ? 'vote/' + collect.voteID : 'topic/' + collect.articleID}`" class="no-underline">阅读全文<Icon type="chevron-right"></Icon></a>
                    </p>
                </div>
            </div>
        </div>
        <app-footer />
    </div>
</template>

<script>
    import request from '~/net/request'
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'

    export default {
        data () {
            return {}
        },
        validate ({ params }) {
            var userID = !!params.id
            return userID
        },
        asyncData (context) {
            const query = context.query || {}
            if (!parseInt(query.collect)) {
                return context.error({ statusCode: 404, message: 'Page not found' })
            }
            return Promise.all([
                request.getCollectDirList({
                    client: context.req,
                    params: {
                        userID: context.params.id
                    }
                }),
                request.getPublicUser({
                    client: context.req,
                    params: {
                        id: context.params.id
                    }
                }),
                request.collectList({
                    client: context.req,
                    query: {
                        folderID: query.collect,
                        userID: context.params.id
                    }
                })
            ]).then(res => {
                return {
                    user: context.user,
                    currentUser: res[1].data.user,
                    collects: res[0].data.folders || [],
                    collectList: res[2].data.collects,
                    folderID: query.collect
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        head () {
            return {
                title: '收藏'
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
    @import '../../../assets/styles/mine/index.css';
    @import '../../../assets/styles/user/collectList.css';
</style>
