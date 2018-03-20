<template>
    <div class="articles-container">
        <div class="article-top">
            <div>{{isAuthor ? '我' : (sex ? '她' : '他')}}的图书</div>
        </div>
        <template v-if="books.length > 0">
            <div v-for="(book, index) in books" class="articles-item" :class="{'articles-item-no': index === 0}">
                <div class="book-img-box"><img :src="book.coverURL"/></div>
                <div class="book-intro">
                    <h2 class="book-title"><a :href="`/book/${book.id}`" target="_blank">{{book.name}}</a></h2>
                    <div class="golang123-digest" v-html="book.htmlContent"></div>
                    <div v-if="isAuthor" class="book-actions">
                        <Dropdown>
                            <a href="javascript:void(0)" class="book-actions-btn">
                                操作
                                <Icon type="arrow-down-b"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem>发布</DropdownItem>
                                <DropdownItem><a :href="`/book/edit/${book.id}`">编辑图书</a></DropdownItem>
                                <DropdownItem><a :href="`/book/edit/chapter/${book.id}`">编辑章节</a></DropdownItem>
                                <DropdownItem>删除</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <div style="text-align: center;">
                <Page class="common-page"
                    :current="pageNo"
                    :page-size="pageSize"
                    :total="totalCount"
                    @on-change="onPageChange"
                    :show-elevator="true"/>
            </div>
        </template>
        <div v-else class="articles-item-empty">
            还没有创作过图书
        </div>
    </div>
</template>

<script>
    import trimHtml from 'trim-html'
    import request from '~/net/request'
    import htmlUtil from '~/utils/html'

    export default {
        data () {
            return {
                sex: 0
            }
        },
        asyncData (context) {
            let currentId = parseInt(context.params.id)
            let isAuthor = !!(context.user && context.user.id === currentId)
            let apiFunc = isAuthor ? request.getMyBooks : request.getUserPublicBooks
            return apiFunc({
                client: context.req,
                params: {
                    userID: context.params.id
                },
                query: {
                    pageNo: context.query.pageNo || 1,
                    pageSize: 20
                }
            }).then(res => {
                let books = res.data.books || []
                for (let i = 0; i < books.length; i++) {
                    let limit = 100
                    let trimObj = trimHtml(books[i].htmlContent, {
                        limit: limit,
                        suffix: '',
                        moreLink: false
                    })
                    let content = trimObj.html
                    content = htmlUtil.trimImg(content)
                    if (!trimObj.more) {
                        let newTrimObj = trimHtml(books[i].htmlContent, {
                            limit: limit,
                            suffix: '',
                            moreLink: false,
                            preserveTags: false // Strip HTML tags (default true)
                        })
                        content = newTrimObj.html
                    }
                    books[i].htmlContent = content
                }
                return {
                    pageNo: res.data.pageNo,
                    pageSize: res.data.pageSize,
                    totalCount: res.data.totalCount,
                    books: res.data.books || [],
                    user: context.user, // 当前的登录用户，没登录的话为空
                    currentId: currentId, // 当前个人主页的用户id
                    isAuthor: isAuthor // 当前用户是否是作者自己
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        mounted () {
            this.$data.sex = this.$parent.currentUser.sex
        },
        methods: {
            onPageChange (value) {
                let userId = this.currentId
                window.location.href = `/user/${userId}/book?pageNo=${value}`
            }
        }
    }
</script>
