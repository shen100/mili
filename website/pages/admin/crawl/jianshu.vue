<template>
    <Row>
        <h1 class="crawler-title">简书</h1>
        <crawler :from="1" :defaultURL="url" :cateId="cateId" :categories="categories"/>
    </Row>
</template>

<script>
    import crawler from '~/components/admin/crawler'
    import request from '~/net/request'

    export default {
        layout: 'admin',
        middleware: 'adminRequired',

        asyncData (context) {
            return request.getCategories({
                client: context.req
            }).then((res) => {
                let categories = res.data.categories
                return {
                    cateId: (categories && categories[0].id + '') || '',
                    categories: categories
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },

        data () {
            return {
                url: 'http://www.jianshu.com/c/c7634b78294d?order_by=added_at&page=2'
            }
        },
        components: {
            'crawler': crawler
        },
        head () {
            return {
                title: '简书'
            }
        }
    }
</script>

<style>
    .crawler-title {
        font-size: 22px;
        margin: 12px 0 12px 0;
    }
</style>
