<template>
    <div class="article-content-page">
        <h1 class="article-detail-title">{{article.name | entity2HTML}}</h1>
        <div class="article-content-box">
            <div class="article-header">
                <div class="user-avatar-box"><img class="user-avatar" :src="article.user.avatarURL" /></div>
                <div class="article-info-box">
                    <div class="user-name">{{article.user.name}}</div>
                    <div>
                        <span class="article-create-time">{{article.createdAt | getReplyTime}}</span>
                        <span class="dot"></span>
                        <span class="article-comment-count">{{article.commentCount}}回复</span>
                    </div>
                </div>
            </div>
            <div class="golang123-editor golang123-richtxt" v-html="article.htmlContent"></div>
        </div>
        <div id="topicAdBox">
            <baiduAd20x3A />
        </div>
    </div>
</template>

<script>
    import htmlUtil from '~/utils/html'
    import request from '~/net/request'
    import dateTool from '~/utils/date'
    import baiduAd20x3A from '~/components/ad/baidu/ad20x3A'

    export default {
        data () {
            return {
            }
        },
        validate ({ params }) {
            var hasId = !!params.id
            return hasId
        },
        asyncData (context) {
            return request.getArticle({
                client: context.req,
                params: {
                    id: context.params.id
                }
            }).then(function (data) {
                let article = data.data.article
                console.log(article)
                if (!article) {
                    context.error({ statusCode: 404, message: 'Page not found' })
                    return
                }
                return {
                    article: article
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        head () {
            return {
                title: this.article.name,
                link: [
                    { rel: 'stylesheet', href: '/styles/highlight/codestyle.css' } // Solarized Light
                ],
                script: [
                    { src: '/javascripts/highlight/highlight.min.js' }
                ]
            }
        },
        components: {
            'baiduAd20x3A': baiduAd20x3A
        },
        filters: {
            getReplyTime: dateTool.getReplyTime,
            entity2HTML: htmlUtil.entity2HTML
        }
    }
</script>

<style lang="less">
    @import '../../assets/styles/topic/detail.less';
</style>
