<template>
    <div>
        <Breadcrumb>
            <BreadcrumbItem to="/">首页</BreadcrumbItem>
            <BreadcrumbItem>开源图书</BreadcrumbItem>
        </Breadcrumb>
        <div>
            <Button type="primary" @click="onNew">创建分类</Button>
        </div>
        <Table :columns="columns" :data="categories">
            <template slot-scope="{ row }" slot="action">
                <Button type="primary" size="small" @click="onEdit(row)">编辑</Button>
            </template>
        </Table>
        <Modal
            @on-visible-change="onModalVisibleChange"
            :value="modalVisible"
            :title="categoryID ? '编辑分类' : '创建分类'"
            footer-hide>
            <Form v-if="modalVisible" ref="formNode" :model="formData" :rules="rules" :label-width="80">
                <FormItem prop="name" label="分类名称">
                    <Input v-model="formData.name" placeholder="请输入分类名称" />
                </FormItem>
                <FormItem prop="sequence" label="顺序">
                     <InputNumber placeholder="输入顺序" :step="1" :max="100" :min="0" v-model="formData.sequence"></InputNumber>
                </FormItem>
                <FormItem prop="pathname" label="路径">
                    <div style="display: flex;">
                        <span style="margin-right: 6px;">/</span><Input v-model="formData.pathname" placeholder="请输入路径" />
                    </div>
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
        return {
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
                    title: '顺序',
                    key: 'sequence'
                },
                {
                    title: '路径',
                    key: 'pathname'
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
            formData: {
                name: '',
                sequence: '',
                pathname: '',
            },
            rules: {
                name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ],
                sequence: [
                    { required: true, type: 'integer', message: '无效的顺序' },
                ],
                pathname: [
                    {
                        required: true,
                        trigger: 'change',
                        validator: (rule, value, callback) => {
                            if (!value || value.charAt(0) === '/') {
                                callback(new Error('无效的路径'));
                                return;
                            }
                            callback();
                        }
                    }
                ]
            },
            categories: [],
            categoryID: undefined,
            modalVisible: false,
        };
    },
    mounted() {
        this.reqList();
    },
    methods: {
        onModalVisibleChange(visible) {
            this.modalVisible = visible;
        },
        reqList() {
            myHTTP.get('/books/categories/all').then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    const categories = res.data.data;
                    this.categories = categories.map(c => {
                        return {
                            ...c,
                            createdAt: formatYMDHMS(c.createdAt),
                            updatedAt: formatYMDHMS(c.updatedAt)
                        };
                    });
                }
            });
        },
        onNew() {
            this.categoryID = undefined;
            this.formData.name = '';
            this.formData.sequence = 0;
            this.formData.pathname = '';
            this.modalVisible = true;
        },
        onEdit(row) {
            this.categoryID = row.id;
            this.formData.name = row.name;
            this.formData.sequence = row.sequence;
            this.formData.pathname = row.pathname;
            this.modalVisible = true;
        },
        onOk() {
            this.$refs['formNode'].validate((valid) => {
                if (!valid) {
                    return;
                }
                let reqMethod;
                let url = '/admin/categories';
                const data = {
                    name: this.formData.name,
                    sequence: this.formData.sequence,
                    pathname: this.formData.pathname,
                };
                if (this.categoryID) {
                    reqMethod = myHTTP.put;
                    url += `/${this.categoryID}`;
                    data.id = this.categoryID;
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
    },
    components: {
    }
}
</script>

<style lang="scss" scoped>
</style>
