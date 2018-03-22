<template>
    <div>
        <div class="create-book-step">
            <Steps v-if="stepVisible" :current="0">
                <Step title="基本信息" content="填写图书基本信息"></Step>
                <Step title="添加章节" content="添加图书章节"></Step>
                <Step title="发布图书" content="发布图书以便其他用户阅读"></Step>
            </Steps>
        </div>
        <book :book="book" :user="user"/>
    </div>
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
                    stepVisible: false,
                    book: book,
                    user: context.user
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        middleware: 'userRequired',
        mounted () {
            this.stepVisible = true
        },
        components: {
            'book': Book
        }
    }
</script>

<style>
    @import '../../../assets/styles/book/edit.css'
</style>
