<template>
    <div>
        <Breadcrumb>
            <BreadcrumbItem to="/">首页</BreadcrumbItem>
            <BreadcrumbItem>话题</BreadcrumbItem>
        </Breadcrumb>
        <div>
            <Button type="primary" @click="onNewTopic">创建话题</Button>
        </div>
        <Table :columns="columns" :data="topics">
            <template slot-scope="{ row }" slot="action">
                <Button type="primary" size="small" @click="onEdit(row)">编辑</Button>
            </template>
        </Table>
        <Modal
            @on-visible-change="onModalVisibleChange"
            :value="modalVisible"
            :title="topicID ? '编辑话题' : '创建话题'"
            footer-hide>
            <Form ref="formNode" :model="formData" :rules="rules" :label-width="80">
                <FormItem prop="name" label="话题名称">
                    <Input v-model="formData.name" placeholder="请输入话题名称" />
                </FormItem>
                <FormItem prop="sequence" label="排序">
                    <InputNumber :max="10" :min="1" v-model="formData.sequence"></InputNumber>                    
                </FormItem>
            </Form>
            <div class="admin-modal-footer">
                <Button size="large" @click="onCancel">取消</Button>
                <Button class="ok" size="large" type="primary" @click="onOk">确认</Button> 
            </div>
        </Modal>
    </div>
</template>

<script>
import { ErrorCode } from '~/js/constants/error.js';
import { myHTTP } from '~/js/common/net.js';
import { formatYMDHMS } from '~/js/utils/date';

export default {
    data () {
        const defaultSequence = 1;
        return {
            defaultSequence,
            topicID: undefined,
            modalVisible: false,
            formData: {
                name: '',
                sequence: defaultSequence,
            },
            rules: {
                name: [
                    { required: true, message: '请输入话题名称', trigger: 'blur' }
                ],
            },
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
                    title: '排序',
                    key: 'sequence'
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
            topics: []
        };
    },
    mounted() {
        this.reqList();
    },
    methods: {
        onEdit(row) {
            this.topicID = row.id;
            this.formData.name = row.name;
            this.formData.sequence = row.sequence;
            console.log('========xxxxxxxxxxxx');
            this.modalVisible = true;
        },
        onOk() {
            this.$refs['formNode'].validate((valid) => {
                if (!valid) {
                    return;
                }
                let reqMethod;
                let url = '/admin/boilingpoint/topics';
                const data = {
                    name: this.formData.name,
                    sequence: this.formData.sequence,
                };
                if (this.topicID) {
                    reqMethod = myHTTP.put;
                    url += `/${this.topicID}`;
                } else {
                    reqMethod = myHTTP.post;
                }
                reqMethod(url, data).then((res) => {
                    if (res.data.errorCode !== ErrorCode.SUCCESS.CODE) {
                        this.$Message.error(res.data.message);
                        return;
                    }
                    this.modalVisible = false;
                    this.formData.name = '';
                    this.formData.sequence = this.defaultSequence;
                    this.reqList();
                }).catch(err => {
                    this.$Message.error(err.message);
                });
            });
            return false;
        },
        onCancel() {
            this.modalVisible = false;
        },
        reqList() {
            myHTTP.get('/admin/boilingpoint/topics').then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    let topics = res.data.data.topics;
                    topics = topics.map(topic => {
                        return {
                            ...topic,
                            createdAt: formatYMDHMS(topic.createdAt),
                            updatedAt: formatYMDHMS(topic.updatedAt)
                        };
                    });
                    this.topics = topics;
                }
            });
        },
        onNewTopic() {
            this.topicID = undefined;
            this.formData.name = '';
            this.formData.sequence = this.defaultSequence;
            this.modalVisible = true;
        },
        onModalVisibleChange(visible) {
            this.modalVisible = visible;
            console.log(arguments);
        }
    },
    components: {
    }
}
</script>

