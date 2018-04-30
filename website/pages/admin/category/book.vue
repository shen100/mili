<template>
    <Row>
        <h1 class="book-category-title">图书分类</h1>
        <Row>
            <Table class="admin-common-line" :columns="columns" :data="bookCategories"/>
        </Row>
        <Form ref="categoryForm" :model="formData" :rules="formRule" :label-width="120">
            <FormItem label="分类名称" prop="name">
                <Row>
                    <Col span="12">
                        <Input v-model.trim="formData.name" placeholder="请输入分类名称"></Input>
                    </Col>
                </Row>
            </FormItem>
            <Form-item :label-width="0">
                <Button size="large" type="primary" @click="onSubmit">提交</Button>
            </Form-item>
        </Form>
    </Row>
</template>

<script>
    import ErrorCode from '~/constant/ErrorCode'
    import request from '~/net/request'
    import config from '~/config'

    export default {
        data () {
            return {
                columns: [
                    {
                        title: 'id',
                        key: 'id'
                    },
                    {
                        title: '分类名称',
                        key: 'name'
                    }
                ]
            }
        },
        asyncData (context) {
            return request.getAllBookCategories({
                client: context.req
            }).then(res => {
                let bookCategories = res.data.categories
                return {
                    bookCategories: bookCategories,
                    formData: {
                        name: ''
                    },
                    formRule: {
                        name: [
                            { required: true, message: '请输入分类名称', trigger: 'blur' }
                        ]
                    }
                }
            })
        },
        methods: {
            reset () {
                this.formData.name = ''
            },
            onSubmit () {
                this.$refs['categoryForm'].validate((valid) => {
                    if (valid) {
                        let self = this
                        request.createBookCategory({
                            body: {
                                name: self.formData.name
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.SUCCESS) {
                                self.bookCategories.push(res.data.category)
                                self.reset()
                                self.$Message.success({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: '图书分类创建成功'
                                })
                            } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                                location.href = '/signin?ref=' + encodeURIComponent(location.href)
                            } else {
                                self.$Message.error({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: res.msg
                                })
                            }
                        })
                    }
                })
                return false
            }
        },
        head () {
            return {
                title: '图书分类列表'
            }
        },
        mounted () {
        },
        layout: 'admin'
    }
</script>

<style>
    .book-category-title {
        font-size: 22px;
        margin: 12px 0 12px 0;
    }
</style>
