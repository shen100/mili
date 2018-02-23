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
        middleware: 'userRequired',
        components: {
            'book': Book
        }
    }
</script>
