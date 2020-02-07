<template>
    <div class="articles-container">
        <div class="article-top">
            <div>{{user && user.id == this.currentId ? '我' : (sex ? '她' : '他')}}的收藏夹</div>
        </div>
        <template v-if="collects.length > 0">
            <div v-for="(collect, index) in collects" class="articles-item" :class="{'articles-item-no': index === 0}">
                <h2 class="articles-title"><a :href="`/user/collect/${currentId}?folder=${collect.id}`" target="_blank">{{collect.name}}</a></h2>
                <p class="collect-line">
                    <span>{{collect.updatedAt | formatYMD}}&nbsp更新</span>
                    <span class="collect-content-count">{{collect.collectCount}}条内容</span>
                </p>
            </div>
        </template>
        <div v-else class="articles-item-empty">
            还没有收藏
        </div>
    </div>
</template>

<script>
    import request from '~/net/request'
    import dateTool from '~/utils/date'

    export default {
        data () {
            return {
                sex: 0
            }
        },
        asyncData (context) {
            return request.getCollectDirList({
                client: context.req,
                params: {
                    userID: context.params.id
                }
            }).then(res => {
                return {
                    user: context.user,
                    currentId: context.params.id,
                    collects: res.data.folders || []
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        mounted () {
            this.$data.sex = this.$parent.currentUser.sex
            console.log(this.collects)
        },
        filters: {
            formatYMD: dateTool.formatYMD
        }
    }
</script>
