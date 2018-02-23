<template>
    <book :book="book" :user="user"/>
</template>

<script>
    import Book from '~/components/book/save'
    import request from '~/net/request'

    export default {
        validate ({ params }) {
            var hasId = !!params.id
            return hasId
        },
        asyncData (context) {
            return request.getBook({
                client: context.req,
                params: {
                    id: context.params.id
                }
            }).then(function (res) {
                return {
                    book: res.data.book,
                    user: context.user
                }
            })
        },
        middleware: 'userRequired',
        components: {
            'book': Book
        }
    }
</script>
