<template>
	<div>
		<admin-header />
		<div class="admin-body">
			<admin-sidebar class="admin-sidebar-container" />
			<div class="admin-body-container">
				<router-view></router-view>
			</div>
		</div>
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
	@import '~iview/dist/styles/iview.css';
	.admin-sidebar-container, .admin-body-container {
		float: left;
	}
	.admin-body-container {
		padding-left: 10px;
	}
</style>