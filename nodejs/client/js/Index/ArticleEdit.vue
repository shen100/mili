<template>
	<Row>
		<h1>{{title}}</h1>
		<Col :span="16" class="admin-article-form">
			<Form ref="articleInline" :model="articleInline" :rules="ruleInline" :label-width="80">
		        <Form-item prop="title" label="文章标题">
		            <Input type="text" v-model="articleInline.title" placeholder="文章标题" />
		        </Form-item>
		        <Form-item prop="categories" label="所属频道">
		            <Select v-model="articleInline.categories" placeholder="请选择所在地">
		                <Option v-for="(item, index) in select" :key="index" :value="item.id + ''">{{item.name}}</Option>
		            </Select>
		        </Form-item>
		        <Form-item prop="content" label="编辑文章">
		        	<Input type="textarea" v-model="articleInline.content" :autosize="{minRows: 2}" placeholder="请输入文章内容" />
		        </Form-item>
		        <Form-item>
		        	<Row type="flex" justify="space-around">
			            <Button type="primary" @click="handleSubmit('articleInline')">提交</Button>
			            <Button type="ghost" @click="back">返回</Button>
		            </Row>
		        </Form-item>
		    </Form>
		</Col>
	</Row>
</template>

<script>
    import Request from '../utils/Request';

    export default {
        data () {
            return {
            	title: (this.$route.params && this.$route.params.id) ? '编辑文章' : '新增文章',
                articleInline: {
                    title: '',
                    categories: '',
                    content: ''
                },
                select: [],
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
                const self = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                    	const params = this.$route.params || {};
                    	const id = params.id || null;
                        const requestFunc = id ? Request.updateArticle : Request.createArticle;
                		requestFunc({
            				id,
            				name: this.articleInline.title,
            				content: this.articleInline.content,
            				categories: [
            					{
            						id: parseInt(this.articleInline.categories)
            					}
            				]
            			})
            			.then(res => {
        					self.$Message.success('提交成功!');
        					self.back();
            			})
                        .catch(err => {
                            self.$Message.error(err.msg);
                        });

                    }
                })
            },
            back() {
	        	this.$router.push('/admin/article');
	        },
        },
        mounted() {
            const self = this;
        	const params = this.$route.params || {};
        	const id = params.id || '';
        	Request.getCategories()
        		.then(res => {
					this.select = res.categories;
        		})
                .catch(err => {
                    self.$Message.error(err.msg);
                })
        	if (id) {
        		Request.getArticleItem({params: id})
        			.then(res => {
    					self.articleInline = {
    						title: res.article.name,
    						categories: res.article.categories[0].id + '',
    						content: res.article.content
    					}
        			})
                    .catch(err => {
                        self.$Message.error(err.msg)
                    })
        	}
        }
    }
</script>

<style>
	.admin-article-form {
		margin-top: 20px;
	}
</style>