<template>
	<Row>
		<h1 class="admin-common-line">文章列表</h1>
		<Row class="admin-common-line" type="flex" justify="end">
			<Col>
				<router-link to="/admin/article/add">
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
	import Request from '../../utils/Request';

	// 分类管理
	// 2 审核通过
	// 1 审核中
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
                                            this.changeStatus(obj.row.id, 2)
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
				const self = this;
				Request
					.updateAdminArticles({
						id,
						status
					})
					.then(res => {
						self.$Message.success('操作成功');
						self.list.map((item, index) => {
							if (item.id === res.id) {
								item.status = res.status;
							}
						});
					})
					.catch(err => {
						self.$Message.error(err.msg);
					})
			}
		},
		mounted() {
			const self = this;
			Promise.all([
					Request.getCategories(), 
					Request.getAdminArticles()
				])
				.then(arr => {
					this.select = arr[0].categories;
					this.list = arr[1].articles;
				})
				.catch(err => {
					self.$Message.error(err.msg)
				})
		}
	}
</script>

<style>
	
</style>