<template>
    <div>
        <div class="book-categoties-box">
            <a href="/book" class="categoties-item" :class="{'categoties-select': !cate}">全部</a>
            <a v-for="cateItem in categories" class="categoties-item" :href="'/book?cate=' + cateItem.id" :class="{'categoties-select': cateItem.id == cate}">{{cateItem.name}}</a>
        </div>
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
            const query = context.query || {}
            return Promise.all([
                request.getBookCategories({
                    client: context.req
                }),
                request.getBooks({
                    client: context.req,
                    query: {
                        cateId: query.cate || ''
                    }
                })
            ]).then((arr) => {
                let categories = arr[0].data.categories
                let books = arr[1].data.books
                return {
                    categories: categories,
                    books: books,
                    cate: query.cate || ''
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
