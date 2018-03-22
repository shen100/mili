<template>
    <div class="articles-container">
        <div class="article-top">
            <div>{{isAuthor ? '我' : (sex ? '她' : '他')}}的图书</div>
        </div>
        <template v-if="books.length > 0">
            <div v-for="(book, index) in books" class="articles-item" :class="{'articles-item-no': index === 0}">
                <div class="book-img-box">
                    <a :href="`/book/${book.id}`" target="_blank">
                        <img v-if="book.coverURL" :src="book.coverURL"/>
                        <div v-else class="book-no-img">无封面</div>
                    </a>
                </div>
                <div class="book-intro">
                    <h2 class="book-title"><a :href="`/book/${book.id}`" target="_blank">{{book.name}}</a></h2>
                    <div class="golang123-digest" v-html="book.htmlContent"></div>
                    <div v-if="isAuthor" class="book-actions">
                        <Dropdown @on-click="onClickBookDropdown">
                            <a href="javascript:void(0)" class="book-actions-btn">
                                操作
                                <Icon type="arrow-down-b"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem v-if="book.status === 'book_unpublish'" :name="`book_unpublish-${book.id}`">发布</DropdownItem>
                                <DropdownItem v-else-if="book.status === 'book_verifying'" :name="`book_verifying-${book.id}`" disabled>审核中</DropdownItem>
                                <DropdownItem v-else-if="book.status === 'book_verify_success'" :name="`book_verify_success-${book.id}`" disabled>已发布</DropdownItem>
                                <DropdownItem v-else-if="book.status === 'book_verify_fail'" :name="`book_verify_fail-${book.id}`" disabled>未通过审核</DropdownItem>
                                <DropdownItem divided :name="`book_edit-${book.id}`"><a :href="`/book/edit/${book.id}`">编辑图书</a></DropdownItem>
                                <DropdownItem :name="`book_chapter_edit-${book.id}`"><a :href="`/book/edit/chapter/${book.id}`">编辑章节</a></DropdownItem>
                                <DropdownItem :name="`book_delete-${book.id}`">删除</DropdownItem>
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
    import config from '~/config'
    import ErrorCode from '~/constant/ErrorCode'
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
                console.log(res.data)
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
            onClickBookDropdown (name) {
                let [status, bookID] = name.split('-')
                bookID = parseInt(bookID)
                let self = this
                switch (status) {
                case 'book_unpublish': {
                    self.$Modal.confirm({
                        title: '发布图书',
                        content: '确定要发布图书?',
                        onOk () {
                            request.publishBook({
                                params: {
                                    bookID: bookID
                                }
                            }).then(res => {
                                if (res.errNo === ErrorCode.SUCCESS) {
                                    self.$Message.success({
                                        duration: config.messageDuration,
                                        closable: true,
                                        content: '发布成功'
                                    })
                                    self.onBookPublished(bookID)
                                } else {
                                    self.$Message.error({
                                        duration: config.messageDuration,
                                        closable: true,
                                        content: res.msg
                                    })
                                }
                            }).catch(err => {
                                err = '内部错误'
                                self.$Message.error({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: err
                                })
                            })
                        },
                        onCancel () {

                        }
                    })
                    break
                }
                case 'book_chapter_edit': {
                    break
                }
                case 'book_chapter': {
                    break
                }
                case 'book_delete': {
                    self.$Modal.confirm({
                        title: '删除图书',
                        content: '确定要删除这个图书?',
                        onOk () {
                            request.deleteBook({
                                params: {
                                    id: bookID
                                }
                            }).then(res => {
                                if (res.errNo === ErrorCode.SUCCESS) {
                                    self.$Message.success({
                                        duration: config.messageDuration,
                                        closable: true,
                                        content: '已删除'
                                    })
                                    setTimeout(function () {
                                        location.reload()
                                    }, 500)
                                } else {
                                    self.$Message.error({
                                        duration: config.messageDuration,
                                        closable: true,
                                        content: res.msg
                                    })
                                }
                            }).catch(err => {
                                err = '内部错误'
                                self.$Message.error({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: err
                                })
                            })
                        },
                        onCancel () {

                        }
                    })
                    break
                }
                }
            },
            onBookPublished (bookID) {
                for (let i = 0; i < this.books.length; i++) {
                    if (this.books[i].id === bookID) {
                        this.books[i].status = 'book_verify_success'
                        console.log(this.books[i].status)
                        break
                    }
                }
            },
            onPageChange (value) {
                let userId = this.currentId
                window.location.href = `/user/${userId}/book?pageNo=${value}`
            }
        }
    }
</script>
