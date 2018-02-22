<template>
    <book :book="book" :user="user"/>
</template>

<script>
    import Book from '~/components/book/save'

    export default {
        asyncData (context) {
            return {
                book: null,
                user: context.user
            }
        },
        layout: 'nosidebar',
        middleware: 'userRequired',
        components: {
            'book': Book
        }
    }
</script>
