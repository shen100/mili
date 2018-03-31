<template>
    <div>
        <ul class="book-list">
            <li v-for="(book, i) in books" class="book-item" :style="{'margin-right': (i + 1) % 5 == 0 ? 0 : '20px'}">
                <a class="book-detial-link" :href="`/book/${book.id}`" target="_blank">
                    <div class="book-item-img">
                        <img v-if="book.coverURL" :src="book.coverURL">
                        <div v-else class="book-no-img">无封面</div>
                    </div>
                    <h3 :title="book.name" class="book-item-title">{{book.name | entity2HTML}}</h3>
                <!-- <div class="book-item-producer">{{book.user.name}}</div> -->
                </a>
            </li>
        </ul>
        <baidu-banner900x110 />
    </div>
</template>

<script>
    import request from '~/net/request'
    import htmlUtil from '~/utils/html'
    import baiduBanner900x110 from '~/components/ad/baidu/banner900x110'

    export default {
        asyncData (context) {
            context.store.commit('publishTopicVisible', false)
            context.store.commit('createBookVisible', true)
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
            'baidu-banner900x110': baiduBanner900x110
        }
    }
</script>

<style>
    @import '../../assets/styles/book/list.css'
</style>
