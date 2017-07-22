<template>
	<Row>
		<h1>文章编辑</h1>
		<Col :span="16" class="admin-article-form">
			<Form ref="articleInline" :model="articleInline" :rules="ruleInline" :label-width="80">
		        <Form-item prop="title" label="文章标题">
		            <Input type="text" v-model="articleInline.title" placeholder="文章标题" />
		        </Form-item>
		        <Form-item prop="categories" label="所属频道">
		            <Select v-model="articleInline.categories" placeholder="请选择所在地">
		                <Option value="1">精华</Option>
		                <Option value="2">问答</Option>
		                <Option value="3">招聘</Option>
		            </Select>
		        </Form-item>
		        <Form-item prop="content" label="编辑文章">
		        	<Input type="textarea" v-model="articleInline.content" :autosize="{minRows: 2}" placeholder="请输入文章内容" />
		        </Form-item>
		        <Form-item>
		            <Button type="primary" @click="handleSubmit('articleInline')">提交</Button>
		        </Form-item>
		    </Form>
		</Col>
	</Row>
</template>

<script>
    export default {
        data () {
            return {
                articleInline: {
                    title: '',
                    categories: '',
                    content: ''
                },
                ruleInline: {
                    title: [
                        { required: true, message: '请输入文章标题', trigger: 'blur' }
                    ],
                    categories: [
                        { required: true, message: '请选择文章所属频道', trigger: 'change' },
                    ],
                    content: [
                        { required: true, message: '请选择文章所属频道', trigger: 'blur' },
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('提交成功!');
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            }
        },
        mounted() {
        	console.log(this);
        }
    }
</script>

<style>
	.admin-article-form {
		margin-top: 20px;
	}
</style>