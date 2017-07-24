<template>
	<Row>
		<h1 class="admin-common-line">文章列表</h1>
		<Row class="admin-common-line" type="flex" justify="end">
			<Col>
				<router-link to="/article/add">
					<Button type="primary">新增</Button>
				</router-link>
			</Col>
			<Col :span="6" :offset="1">
				<Select>
					<Option v-for="(item, index) in select" :key="index" :value="item.id + ''">{{item.name}}</Option>
				</Select>
			</Col>
		</Row>
		<Table 
			class="admin-common-line"
			:columns="column"
			:data="list"/>
	</Row>
</template>

<script>
	import moment from 'moment';
	import config from '../config';

	const categoriesAPI = config.api.categories;
	const articleAdminAPI = config.api.articleAdmin;

	// 分类管理
	// 1 审核通过
	// 2 审核中
	// 3 审核未通过

	export default {
		data() {
			return {
				select: [],
				column: [
					{
						title: '文章名称',
						key: 'name'
					},
					{
						title: '创建时间',
						key: 'createdAt',
						render: (h, obj) => {
							return moment(obj.row.createdAt).utc().format('YYYY-MM-DD HH:mm:ss');
						}
					},
					{
						title: '最近更新',
						key: 'updatedAt',
						render: (h, obj) => {
							return moment(obj.row.updatedAt).utc().format('YYYY-MM-DD HH:mm:ss');
						}
					},
					{
						title: '分类',
						key: 'categories',
						render: (h, obj) => {
							return obj.row.categories[0].name;
						}
					},
					{
						title: '当前状态',
						key: 'status',
						render: (h, obj) => {
							switch(obj.row.status) {
								case 1: return '审核通过';
								case 2: return '审核中';
								default: return '审核未通过';
							}
						}
					},
					{
						title: '审核',
						key: 'id',
						render: (h, obj) => {
							return h('Row', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.changeStatus(obj.row.id, 1)
                                        }
                                    }
                                }, '通过'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.changeStatus(obj.row.id, 3)
                                        }
                                    }
                                }, '不通过')
                            ]); 
						}
					}
				],
				list: []
			}
		},
		methods: {
			changeStatus(id, status) {
				this.$http
					.post(articleAdminAPI.update, {
						id,
						status
					})
					.then(res => {
						if (res.data.errNo === 0) {
							this.$Message.success('操作成功');
							this.list.map((item, index) => {
								if (item.id === res.data.data.id) {
									item.status = res.data.data.status;
								}
							})
						} else {
							this.$Message.error(res.data.msg);
						}
					})
			}
		},
		mounted() {
			Promise.all([
					this.$http.get(categoriesAPI.list), 
					this.$http.get(articleAdminAPI.list)
				])
				.then(arr => {
					if (arr[0].data.errNo === 0) {
						this.select = arr[0].data.data.categories;
					} else {
						this.$Message.error(arr[0].data.msg);
					}
					if (arr[1].data.errNo === 0) {
						this.list = arr[1].data.data.articles;
					} else {
						this.$Message.error(arr[1].data.msg);
					}
					console.log(this);
				})
		}
	}
</script>

<style>
	
</style>