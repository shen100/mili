<template>
    <div>
        <ul class="book-list">
            <li v-for="(book, i) in books" class="book-item" :style="{'margin-right': (i + 1) % 5 == 0 ? 0 : '20px'}">
                <div class="book-item-img">
                    <a :href="`/book/${book.id}`" target="_blank">
                        <img :src="book.coverURL">
                    </a>
                </div>
                <h3 :title="book.name" class="book-item-title">{{book.name | entity2HTML}}</h3>
                <!-- <div class="book-item-producer">{{book.user.name}}</div> -->
            </li>
        </ul>
        <baidu-banner />
    </div>
</template>

<script>
    import request from '~/net/request'
    import htmlUtil from '~/utils/html'
    import baiduBanner from '~/components/ad/baidu/banner1'

    export default {
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
        components: {
            'baidu-banner': baiduBanner
        }
    }
</script>

<style>
    @import '../../assets/styles/book/list.css'
</style>
