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
                query: {
                    f: 'md'
                },
                params: {
                    id: context.params.id
                }
            }).then(function (res) {
                let book = res.data.book
                if (!book) {
                    context.error({ statusCode: 404, message: 'Page not found' })
                    return
                }
                return {
                    book: book,
                    user: context.user
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        middleware: 'userRequired',
        components: {
            'book': Book
        }
    }
</script>
