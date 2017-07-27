<template>
	<div>
		<admin-header />
		<Row class="admin-body">
			<Col :span="5">
				<admin-sidebar class="admin-sidebar-container" />
			</Col>
			<Col class="admin-body-container" :span="18">
				<router-view></router-view>
			</Col>
		</Row>
	</div>
</template>

<script>
	import Header  from '../components/Header';
	import Sidebar from '../components/Sidebar';

	export default {
		components: {
			adminHeader: Header,
			adminSidebar: Sidebar
		}
	}
</script>

<style>
	.admin-sidebar-container, .admin-body-container {
		float: left;
	}
</style>