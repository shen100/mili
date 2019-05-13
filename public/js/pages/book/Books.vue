<template>
    <div id="books">
        <div style="padding: 20px; padding-top: 10px; background: #fff;">
                    <BookLoading />
                </div>
        <Pinterest url="/books" :start="2" :query="{c: categoryID}" @load="onLoad">
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
            books: [],
            categoryID: window.categoryID || undefined,
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

