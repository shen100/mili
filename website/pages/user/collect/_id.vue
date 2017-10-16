<template>
    <div>
        <app-header :user="user" />
        <div class="golang-home-body">
            <div class="golang-home-body-left">
                <p v-if="user && user.id == currentUser.id" class="back-container">
                    <a class="top100-link link-left" href="">« 去我的收藏</a>
                </p>
                <p v-else class="back-container">
                    <a class="top100-link link-left" href="">«  {{currentUser.name}} 的收藏</a>
                    <a class="top100-link link-right" href="" v-if="user">去我的收藏 »</a>
                </p>
                <h1 class="collect-line title">收藏标题</h1>
                <p class="collect-line desc">
                    <a href=""><Icon type="ios-chatbubble-outline"></Icon>添加评论</a>
                    •
                    <a href="">修改记录</a>
                </p>
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
        asyncData (context) {
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
                })

            ]).then(res => {
                return {
                    user: context.user,
                    currentUser: res[1].data.user,
                    collects: res[0].data.folders || []
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        middleware: 'userInfo',
        mounted () {
            console.log(this.collects)
            console.log(this.currentUser)
        },
        components: {
            'app-header': Header,
            'app-footer': Footer
        }
    }
</script>

<style>
    @import '~assets/styles/user/collectList.css'
</style>