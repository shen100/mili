<template>
    <div id="books">
        <Pinterest v-if="bookCount > pageSize" :url="`/books/${categoryPathName}`" :start="2" @load="onLoad">
            <template v-slot:loading>
                <div style="padding: 20px; padding-top: 10px; background: #fff;">
                    <BookLoading />
                </div>
            </template>
            <template v-slot:content>
                <div>
                    <div class="book-list">
                        <BookItem :key="book.id" v-for="book in books" :book="book" />
                    </div>
                </div>
            </template>
        </Pinterest>
    </div>
</template>

<script>
import BookItem from '~/js/components/book/BookItem.vue';
import BookLoading from '~/js/components/book/BookLoading.vue';
import Pinterest from '~/js/components/common/Pinterest.vue';

export default {
    data () {
        return {
            categoryPathName: window.categoryPathName || '',
            books: [],
            bookCount: window.bookCount,
            pageSize: window.pageSize,
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    methods: {
        onLoad(result) {
            this.books = this.books.concat(result.data.data.list);
        }
    },
    components: {
        Pinterest,
        BookLoading,
        BookItem,
    },
}
</script>

<style scoped>
</style>