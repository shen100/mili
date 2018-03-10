<template>
    <div>
        <ul class="book-list">
            <li v-for="(book, i) in books" class="book-item" :style="{'margin-right': (i + 1) % 5 == 0 ? 0 : '20px'}">
                <div class="book-item-img">
                    <a :href="`/book/${book.id}`" target="_blank">
                        <img :src="book.coverURL">
                    </a>
                </div>
                <h3 class="book-item-title">{{book.name | entity2HTML}}</h3>
                <!-- <div class="book-item-producer">{{book.user.name}}</div> -->
            </li>
        </ul>
        <div v-if="allowBaiduAd" id="adBox">
            <div id="banner"></div>
            <div id="ad120x90"></div>
        </div>
    </div>
</template>

<script>
    import request from '~/net/request'
    import htmlUtil from '~/utils/html'
    import config from '~/config'

    export default {
        data () {
            return {
                allowBaiduAd: config.allowBaiduAd
            }
        },
        asyncData (context) {
            return request.getBooks({
                client: context.req
            }).then((res) => {
                return {
                    books: res.data.books
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        head () {
            return {
                title: '图书'
            }
        },
        filters: {
            entity2HTML: htmlUtil.entity2HTML
        },
        mounted () {
            this.$nextTick(function () {
                this.createAd()
            })
        },
        methods: {
            createAd () {
                if (this.allowBaiduAd) {
                    window.BAIDU_CLB_fillSlotAsync(config.baiduAd.banner3, 'banner')
                    window.BAIDU_CLB_fillSlotAsync(config.baiduAd.ad120x90, 'ad120x90')
                }
            }
        }
    }
</script>

<style>
    @import '../../assets/styles/book/list.css'
</style>
