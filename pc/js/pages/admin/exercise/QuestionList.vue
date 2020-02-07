<template>
    <div>
        <div style="margin-bottom: 20px;">
            <Card>
                <Button size="large" type="primary" @click="onCreateClick">创建习题</Button>
            </Card>
        </div>
        <Card>
            <Table :columns="columns" :data="questions" :loading="isLoading">
                <template slot-scope="{ row }" slot="type">
                    <div v-if="row.type + '' === QuestionType.Radio + ''">单选</div>
                    <div v-else>多选</div>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <router-link :to="`${adminPageURL}/exercise/question/${row.id}/edit`">
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
    </div>
</template>

<script>
import { ErrorCode } from '~/js/constants/error.js';
import { myHTTP } from '~/js/common/net.js';
import { formatYMDHMS } from '~/js/utils/date';
import { QuestionType } from '~/js/constants/exercise.js';

export default {
    data () {
        return {
            isLoading: true,
            QuestionType,
            adminPageURL: window.adminPageURL,
            columns: [
                {
                    title: 'id',
                    key: 'id',
                },
                {
                    title: '题目',
                    key: 'title',
                },
                {
                    title: '题型',
                    slot: 'type'
                },
                {
                    title: '答案',
                    key: 'answers'
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
                    title: '操作',
                    slot: 'action'
                },
            ],
            questions: [],
            page: 1,
            pageSize: 20,
            count: 0,
        };
    },
    mounted() {
        this.reqList(1);
    },
    methods: {
        reqList(page) {
            myHTTP.get(`/admin/exercises/questions?page=${page}`).then((res) => {
                this.isLoading = false;
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    const questions = res.data.data.list;
                    this.page = res.data.data.page;
                    this.count = res.data.data.count;
                    this.questions = questions.map(q => {
                        return {
                            ...q,
                            createdAt: formatYMDHMS(q.createdAt),
                            updatedAt: formatYMDHMS(q.updatedAt)
                        };
                    });
                }
            })
        },
        onPageChange(value) {
            this.reqList(value);
        },
        onCreateClick() {
            this.$router.push(`${adminPageURL}/exercise/question/new`);
        }
    },
}
</script>
