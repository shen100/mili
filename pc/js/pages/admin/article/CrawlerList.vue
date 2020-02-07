<template>
    <div>
        <div style="margin-bottom: 20px;">
            <Card>
                <Button size="large" type="primary" @click="onGotoCrawler">抓取文章</Button>
            </Card>
        </div>
        <Card>
            <Table :columns="columns" :data="articles" :loading="isLoading">
                <template slot-scope="{ row }" slot="action">
                    <Button v-if="!row.articleID" type="success" @click="onRequestDetail(row)" size="small">创建文章</Button>
                    <Button v-else type="primary" :to="`/p/${row.articleID}`" target="_blank" size="small">查看文章</Button>
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
        <Modal
            @on-visible-change="onModalVisibleChange"
            :value="modalVisible"
            :title="crawlerArticle && crawlerArticle.articleID ? '更新文章' : '创建文章'"
            footer-hide>
            <template v-if="crawlerArticle">
                <Form ref="formNode" :model="formData" :rules="rules" :label-width="80">
                    <FormItem label="标题">
                        <div>{{crawlerArticle.title}}</div>
                    </FormItem>
                    <FormItem prop="tagID" label="标签">
                        <Select v-model="formData.tagID" filterable>
                            <Option v-for="t in tags" :value="t.id + ''" :key="t.id">{{ t.name }}</Option>
                        </Select>
                    </FormItem>
                </Form>
                <div class="admin-modal-footer">
                    <Button size="large" @click="onCancel">取消</Button>
                    <Button :loading="isUpdatingArticle" class="ok" size="large" type="primary" @click="onOk">确认</Button> 
                </div>
            </template>
        </Modal>
    </div>
</template>

<script>
import { ErrorCode } from '~/js/constants/error.js';
import { myHTTP } from '~/js/common/net.js';
import { formatYMDHMS } from '~/js/utils/date';
import { ArticleContentType } from '~/js/constants/article.js';

export default {
    data () {
        return {
            isLoading: true,
            adminPageURL: window.adminPageURL,
            columns: [
                {
                    title: 'id',
                    key: 'id',
                    width: 120,
                },
                {
                    title: 'title',
                    key: 'title',
                },
                {
                    title: '来源',
                    key: 'fromLabel',
                    width: 120,
                },
                {
                    title: '创建时间',
                    key: 'createdAt',
                },
                {
                    title: '更新时间',
                    key: 'updatedAt',
                },
                {
                    title: '文章id',
                    key: 'articleID',
                    width: 120,
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 120,
                },
            ],
            articles: [],
            page: 1,
            pageSize: 20,
            count: 0,
            tags: [],
            modalVisible: false,
            crawlerArticle: null, // 当前要更新或创建的文章
            formData: {
                tagID: undefined,
            },
            rules: {
                tagID: [
                    { required: true, message: '请选择标签', trigger: 'blur' }
                ],
            },
            isUpdatingArticle: false,
        };
    },
    mounted() {
        this.reqList(1);
        this.reqAllTags();
    },
    methods: {
        reqAllTags() {
            const url = '/tags/all';
            myHTTP.get(url).then((result) => {
                this.tags = result.data.data || [];
            });
        },
        reqList(page) {
            myHTTP.get(`/admin/crawler?page=${page}`).then((res) => {
                this.isLoading = false;
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    const articles = res.data.data.list;
                    this.page = res.data.data.page;
                    this.count = res.data.data.count;
                    this.articles = articles.map(article => {
                        return {
                            ...article,
                            createdAt: formatYMDHMS(article.createdAt),
                            updatedAt: formatYMDHMS(article.updatedAt)
                        };
                    });
                }
            })
        },
        onPageChange(value) {
            this.reqList(value);
        },
        onGotoCrawler() {
            this.$router.push(`${adminPageURL}/article/crawler`);
        },
        onRequestDetail(crawlerArticle) {
            const url = `/admin/crawler/${crawlerArticle.id}`;
            myHTTP.get(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.crawlerArticle = res.data.data;
                    this.modalVisible = true;
                }
            });
        },
        onModalVisibleChange(visible) {
            this.modalVisible = visible;
        },
        onOk() {
            this.$refs['formNode'].validate((valid) => {
                if (!valid) {
                    return;
                }
                this.isUpdatingArticle = true;
                const articleID = this.crawlerArticle.articleID;
                const method = myHTTP.post;
                const url = '/admin/crawler/articles';
                const reqData = {
                    crawlerID: this.crawlerArticle.id,
                    name: this.crawlerArticle.title,
                    content: this.crawlerArticle.content,
                    contentType: ArticleContentType.HTML,
                    tags: [ parseInt(this.formData.tagID) ],
                };
                method(url, reqData).then((res) => {
                    this.isUpdatingArticle = false;
                    if (res.data.errorCode !== ErrorCode.SUCCESS.CODE) {
                        this.$Message.error(res.data.message);
                        return;
                    }
                    for (let i = 0; i < this.articles.length; i++) {
                        const article = this.articles[i];
                        if (article.id === this.crawlerArticle.id) {
                            article.articleID = res.data.data.articleID;
                        }
                    }
                    this.modalVisible = false;
                    this.$Message.success('创建成功');
                }).catch(err => {
                    this.isUpdatingArticle = false;
                });
            });
        },
        onCancel() {
            this.modalVisible = false;
            this.crawlerArticle = null;
        }
    },
}
</script>
