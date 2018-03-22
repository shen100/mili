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

    export default {
        asyncData (context) {
            context.store.commit('publishTopicVisible', false)
            context.store.commit('createBookVisible', true)
            return {
                book: null,
                stepVisible: false,
                user: context.user
            }
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
    @import '../../assets/styles/book/edit.css'
</style>
