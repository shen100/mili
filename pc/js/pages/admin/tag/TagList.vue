<template>
    <div>
        <Breadcrumb>
            <BreadcrumbItem to="/">首页</BreadcrumbItem>
            <BreadcrumbItem>标签</BreadcrumbItem>
        </Breadcrumb>
        <div>
            <Button type="primary" @click="onNewTag">创建标签</Button>
        </div>
        <Table :columns="columns" :data="tags">
            <template slot-scope="{ row }" slot="iconURL">
                <div class="item-icon-box">
                    <div class="item-icon" :style="{'background-image': `url(${row.iconURL})`}" />
                </div>
            </template>
            <template slot-scope="{ row }" slot="categories">
                <ul>
                    <li :key="c.id" v-for="c in row.categories">{{c.name}}</li>
                </ul>
            </template>
            <template slot-scope="{ row }" slot="action">
                <Button type="primary" size="small" @click="onEdit(row)">编辑</Button>
            </template>
        </Table>
        <Modal
            @on-visible-change="onModalVisibleChange"
            :value="modalVisible"
            :title="tagID ? '编辑标签' : '创建标签'"
            footer-hide>
            <Form v-if="modalVisible" ref="formNode" :model="formData" :rules="rules" :label-width="80">
                <FormItem prop="name" label="标签名称">
                    <Input v-model="formData.name" placeholder="请输入标签名称" />
                </FormItem>
                <FormItem prop="iconURL" label="图标">
                    <SimpleUploader ref="simpleUploader" v-if="uploadPolicy" :uploadPolicy="uploadPolicy" 
                        @success="onImgUploadSuccess" @remove="onImgRemove" :img="formData.iconURL"/>
                </FormItem>
                <FormItem prop="categories" label="分类">
                    <Select v-model="formData.categories" multiple>
                        <Option v-for="item in allCategories" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
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
import SimpleUploader from '~/js/components/admin/common/SimpleUploader.vue';

export default {
    data () {
        return {
            uploadPolicy: null,
            tagID: undefined,
            modalVisible: false,
            formData: {
                name: '',
                iconURL: '',
                categories: [], // 选中的分类
            },
            rules: {
                name: [
                    { required: true, message: '请输入标签名称', trigger: 'blur' }
                ],
                iconURL: [
                    {
                        required: true, // 仅仅是为了在图标旁边加个红*
                        trigger: 'change', 
                        validator: (rule, value, callback) => {
                            // 直接回调callback, 由后台来验证
                            callback()
                        }
                    }
                ],
                categories: [
                    {
                        required: true,
                        trigger: 'change', 
                        validator: (rule, value, callback) => {
                            if (!(value && value.length)) {
                                callback(new Error('请选择分类'));
                                return;
                            }
                            callback();
                        }
                    }
                ]
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
                    title: '图标',
                    slot: 'iconURL'
                },
                {
                    title: '所属分类',
                    slot: 'categories'
                },
                {
                    title: '文章数量',
                    key: 'articleCount'
                },
                {
                    title: '关注人数',
                    key: 'followerCount'
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
            tags: [],
            allCategories: [], // 所有的分类
        };
    },
    mounted() {
        this.reqList();
        this.reqAllCategories();
        this.reqPolicy();
    },
    methods: {
        reqPolicy() {
            const url = `/common/oss/policy`;
            myHTTP.get(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.uploadPolicy = res.data.data.uploadPolicy;
                    return;
                }
            }).catch((err) => {

            });
        },
        onEdit(row) {
            this.tagID = row.id;
            this.formData.name = row.name;
            this.formData.iconURL = row.iconURL;
            this.formData.categories = row.categories.map(c => c.id);
            this.modalVisible = true;
            this.$nextTick(() => {
                this.$refs.simpleUploader.setImgURL(row.iconURL);
            });
        },
        onOk() {
            this.$refs['formNode'].validate((valid) => {
                if (!valid) {
                    return;
                }
                let reqMethod;
                let url = '/admin/tags';
                const data = {
                    name: this.formData.name,
                    iconURL: this.formData.iconURL,
                    categories: this.formData.categories,
                };
                if (this.tagID) {
                    reqMethod = myHTTP.put;
                    url += `/${this.tagID}`;
                    data.id = this.tagID;
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
        reqList() {
            myHTTP.get('/tags/with_categories').then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    let tags = res.data.data.list;
                    tags = tags.map(tag => {
                        return {
                            ...tag,
                            createdAt: formatYMDHMS(tag.createdAt),
                            updatedAt: formatYMDHMS(tag.updatedAt)
                        };
                    });
                    this.tags = tags;
                }
            });
        },
        reqAllCategories() {
            myHTTP.get('/categories').then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.allCategories = res.data.data;
                }
            });
        },
        onNewTag() {
            this.tagID = undefined;
            this.formData.name = '';
            this.formData.iconURL = '';
            this.modalVisible = true;
            this.$nextTick(() => {
                this.$refs.simpleUploader.setImgURL('');
            });
        },
        onModalVisibleChange(visible) {
            this.modalVisible = visible;
        },
        onImgUploadSuccess(imgURL) {
            this.formData.iconURL = imgURL;
        },
        onImgRemove() {
            this.formData.iconURL = '';
        }
    },
    components: {
        SimpleUploader,
    }
}
</script>

<style lang="scss" scoped>
.item-icon-box {
    padding: 10px 0;
}

.item-icon {
    border-radius: 2px;
    margin: 0;
    width: 80px;
    height: 80px;
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-flex: 0 0 auto;
    flex: 0 0 auto;
    background-position: 50%;
}
</style>
