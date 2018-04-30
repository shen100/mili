<template>
    <Row class="admin-tag-container">
        <h1>分类管理</h1>
        <Col :span="16" class="admin-tag-form">
            <Row
                v-for="(item, index) in list"
                :key="index"
                align="middle"
                type="flex"
                justify="space-between"
                class="admin-tag-item">
                <span v-if="editIndex !== index">{{item.name}}</span>
                <Form v-if="editIndex === index" ref="editDynamic" :model="editDynamic" class="admin-tag-form" inline>
                    <Form-item
                        prop="value"
                        :rules="{required: true, message: '分类名称不能为空', trigger: 'blur'}">
                        <Input type="text" v-model="editDynamic.value"/>
                    </Form-item>
                    <Form-item>
                        <Button type="primary" @click="handleEditSubmit('editDynamic')">确定</Button>
                        <Button type="ghost" @click="handleEditCancel">取消</Button>
                    </Form-item>
                </Form>
                <span>
                    <span class="admin-status-tag" @click="edit(item.id, index, item.name)">编辑</span>
                    <span class="admin-status-tag" @click="change(item.id, index)">{{item.status == 1 ? '禁用' : '启用'}}</span>
                </span>
            </Row>
            <Form ref="formDynamic" :model="formDynamic" class="admin-tag-form">
                <Form-item
                    v-for="(item, index) in formDynamic.items"
                    :key="index"
                    :prop="'items.' + index + '.value'"
                    :rules="{required: true, message: '分类名称不能为空', trigger: 'blur'}">
                    <Row>
                        <Col span="18">
                            <Input type="text" v-model="item.value" placeholder="请输入..."></Input>
                        </Col>
                        <Col span="3" offset="1">
                            <Button type="ghost" @click="handleRemove(index)">删除</Button>
                        </Col>
                        <Col span="2">
                            <Button type="primary" @click="handleSubmit('formDynamic')">提交</Button>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item v-if="editStatus == 'common'">
                    <Row>
                        <Col span="12">
                            <Button type="dashed" long @click="handleAdd" icon="plus-round">新增</Button>
                        </Col>
                    </Row>
                </Form-item>
            </Form>
        </Col>
    </Row>
</template>
<script>
    import Request from '~/net/request'
    import ErrorCode from '~/constant/ErrorCode'

    let request = false

    export default {
        data () {
            return {
                editIndex: '',
                id: '',
                formDynamic: {
                    items: []
                },
                editDynamic: {},
                editStatus: 'common'
            }
        },
        asyncData (context) {
            return Request
                .getCategories({
                    client: context.req
                })
                .then(res => {
                    console.log(res)
                    const list = res.data.categories || []
                    return {
                        list: list
                    }
                }).catch(err => {
                    self.$Message.error(err.msg)
                })
        },
        methods: {
            handleSubmit (name) {
                const self = this
                this.$refs[name].validate((valid) => {
                    if (valid && !request) {
                        request = true
                        Request
                            .categoryCreate({
                                body: {
                                    parentId: 0,
                                    name: self.formDynamic.items[0].value,
                                    status: 1
                                }
                            }).then(res => {
                                console.log(res)
                                request = false
                                if (res.errNo === ErrorCode.SUCCESS) {
                                    self.$Message.success('提交成功!')
                                    self.list.push(res.data.category)
                                } else {
                                    self.$Message.error(res.msg)
                                }
                                self.formDynamic.items = []
                                self.editStatus = 'common'
                            }).catch(err => {
                                request = false
                                self.$Message.error(err.msg)
                            })
                    }
                })
            },
            handleAdd () {
                this.editStatus = 'create'
                this.formDynamic.items[0] = ({
                    value: ''
                })
            },
            handleRemove (index) {
                this.editStatus = 'common'
                this.formDynamic.items = []
            },
            handleEditSubmit (name) {
                const self = this
                this.$refs[name][0].validate((valid) => {
                    if (valid && !request) {
                        request = true
                        Request
                            .categoryUpdate({
                                body: {
                                    parentId: 0,
                                    name: self.editDynamic.value,
                                    status: self.list[self.editIndex].status,
                                    id: self.list[self.editIndex].id
                                }
                            })
                            .then(res => {
                                request = false
                                self.$Message.success('提交成功!')
                                self.editStatus = 'common'
                                self.list[self.editIndex] = res.data.category
                                this.editStatus = 'common'
                                this.editDynamic = {}
                                this.editIndex = ''
                            })
                            .catch(err => {
                                request = false
                                self.$Message.error(err.msg)
                            })
                    }
                })
            },
            handleEditCancel () {
                this.editStatus = 'common'
                this.editDynamic = {}
                this.editIndex = ''
            },
            edit (id, index, value) {
                this.editStatus = 'edit'
                this.editDynamic = {
                    value: value
                }
                this.editIndex = index
            },
            change (id, index) {
                const self = this
                this.$Modal.confirm({
                    title: '提醒',
                    content: `是否${self.list[index].status === 2 ? '启用' : '禁用'}该标签?`,
                    loading: true,
                    onOk: () => {
                        const status = self.list[index].status === 1 ? 2 : 1
                        if (request) {
                            return
                        }
                        request = true
                        Request
                            .getAdminCategories({
                                body: {
                                    id: id,
                                    status: status
                                }
                            }).then(res => {
                                request = false
                                if (res.errNo === ErrorCode.SUCCESS) {
                                    self.list[index].status = res.data.status
                                } else {
                                    self.$Message.error(res.msg)
                                }
                                self.$Modal.remove()
                            }).catch(err => {
                                request = false
                                self.$Message.error(err.msg)
                            })
                    }
                })
            }
        },
        layout: 'admin',
        mounted () {
            console.log(this.list)
        }
    }
</script>

<style>
    .admin-tag-container, .admin-tag-form {
        margin-top: 20px;
    }
    .admin-tag-item {
        margin-top: 10px;
    }
    .admin-status-tag {
        color: #20a0ff;
        margin-left: 5px;
        cursor: pointer;
    }
    .admin-status-tag:hover {
        color: #000;
    }
</style>
