<template>
    <div>
        <go-header :userStatus="user"/>
    </div>
</template>

<script>
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    // import request from '~/net/request'

    export default {
        data () {
            return {}
        },
        // asyncData (context) {
        //     let reqArr = [
        //         request.getCategories({client: req}),
        //         request.getArticle({
        //             client : req,
        //             params : {
        //                 id: id
        //             }
        //         })
        //     ]
        //     if (context.user) {
        //         reqArr.push(request.getRecentArticles({client: req}))
        //     }
        //     return Promise
        //             .all(reqArr)
        //             .then(arr => {
        //                 return {
        //                     user: context.user
        //                 }
        //             })
        // },
        middleware: 'userInfo',
        components: {
            'go-header': Header,
            'go-footer': Footer
        }
    }
</script>