<template>
    <div>
        <div style="margin-bottom: 20px;">
            <Card>
                <Button size="large" type="primary" @click="onCreateClick">创建</Button>
            </Card>
        </div>
        <Card>
            <Table :columns="columns" :data="books" :loading="isLoading">
                <template slot-scope="{ row }" slot="contentType">
                    <span>{{row.contentType === ArticleContentType.HTML ? '富文本' : 'markdown'}}</span>
                </template>
                <template slot-scope="{ row }" slot="status">
                    <span>{{row.status === BookStatus.BookUnpublish ? '未发布' : '已发布'}}</span>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <Button v-if="row.status === BookStatus.BookUnpublish" type="primary" size="small" @click="publish(row)">发布</Button>
                    <Button v-else type="error" size="small" @click="publish(row)">下架</Button>
                    <router-link :to="`${adminPageURL}/book/${row.id}/edit`">
                        <Button type="primary" size="small">编辑</Button>
                    </router-link>
                </template>
            </Table>
            <Row v-if="count" style="margin-top: 15px;" type="flex" justify="end">
                <span class="ivu-page-total">共 {{count}} 条</span>
                <Page
                    class="common-page"
                    :current="page"
                    :page-size="pageSize"
                    :total="count"
                    @on-change="onPageChange"
                    :show-elevator="true"/>
            </Row>
        </Card>
        <CreateOrUpdateBookModal ref="createModal" />
    </div>
</template>

<script>
import { ErrorCode } from '~/js/constants/error.js';
import { myHTTP } from '~/js/common/net.js';
import { formatYMDHMS } from '~/js/utils/date';
import { ArticleContentType } from '~/js/constants/article.js';
import { BookStatus } from '~/js/constants/book.js';
import CreateOrUpdateBookModal from '~/js/components/admin/book/CreateOrUpdateBookModal.vue';

export default {
    data () {
        return {
            isLoading: true,
            adminPageURL: window.adminPageURL,
            columns: [
                {
                    title: 'id',
                    key: 'id',
                },
                {
                    title: '名称',
                    key: 'name'
                },
                {
                    title: '章节数',
                    key: 'chapterCount'
                },
                {
                    title: '评价数',
                    key: 'starUserCount'
                },
                {
                    title: '编辑器',
                    slot: 'contentType'
                },
                {
                    title: '状态',
                    slot: 'status'
                },
                {
                    title: '创建时间',
                    key: 'createdAt'
                },
                {
                    title: '更新时间',
                    key: 'updatedAt'
                },
                {
                    title: '操作',
                    slot: 'action'
                },
            ],
            books: [],
            ArticleContentType,
            BookStatus,
            page: 1,
            pageSize: 10,
            count: 0,
        };
    },
    mounted() {
        this.reqList(1);
    },
    methods: {
        reqList(page) {
            myHTTP.get(`/admin/books?page=${page}&pageSize=${this.pageSize}`).then((res) => {
                this.isLoading = false;
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    const books = res.data.data.list;
                    this.page = res.data.data.page;
                    this.count = res.data.data.count;
                    this.books = books.map(b => {
                        return {
                            ...b,
                            createdAt: formatYMDHMS(b.createdAt),
                            updatedAt: formatYMDHMS(b.updatedAt)
                        };
                    });
                }
            });
        },
        publish(book) {
            let status = 'unpublish';
            let msg = '已下架';
            if (book.status === this.BookStatus.BookUnpublish) {
                status = 'publish';
                msg = '已发布';
            }
            myHTTP.put(`/admin/books/${book.id}/${status}`).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.$Message.success(msg);
                    this.reqList(1);
                }
            }); 
        },
        onPageChange(value) {
            this.reqList(value);
        },
        onCreateClick() {
            this.$refs.createModal.show();
        }
    },
    components: {
        CreateOrUpdateBookModal,
    }
}
</script>
