<template>  
    <div class="header-box">
        <div @click="onClickMenu" class="menu"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxM3B4IiB2aWV3Qm94PSIwIDAgMTYgMTMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ3LjEgKDQ1NDIyKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5Hcm91cCA0PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IuWFqOWxjyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IjJfZnVsbHNjcmVlbl9jbG9zZS1zaWRlYmFyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTkuMDAwMDAwLCAtMjUuMDAwMDAwKSIgZmlsbD0iIzk3OTc5NyI+CiAgICAgICAgICAgIDxnIGlkPSJHcm91cC00IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOS4wMDAwMDAsIDI1LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS0zIiB4PSIwIiB5PSI1LjUiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxLjUiPjwvcmVjdD4KICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtMyIgeD0iMCIgeT0iMCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjEuNSI+PC9yZWN0PgogICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS0zLUNvcHkiIHg9IjAiIHk9IjExIiB3aWR0aD0iMTYiIGhlaWdodD0iMS41Ij48L3JlY3Q+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="/></div>
        <div class="remaining-space"></div>
		<div @click="onFullscreen" class="fullscreen-btn"><Icon type="md-expand" /></div>
		<div class="user-dropdown">
			<User />
		</div>
    </div>
</template>

<script>
import { toggleFullScreen } from '~/js/utils/dom';
import User from './User.vue';

export default {
	methods: {
		onClickMenu() {
			this.$emit('collapsedChange');
		},
		onFullscreen() {
			toggleFullScreen();
		}
	},
	components: {
		User,
	}
}
</script>

<style lang="scss" scoped>
.header-box {
	padding-left: 20px;
	width: 100%;
	height: 50px;
	display: flex;
	background: #fff;
}

.header-box .menu {
	padding-top: 18px;
	cursor: pointer;
}

.remaining-space {
	flex: 1;
}

.fullscreen-btn {
	font-size: 24px;
	line-height: 48px;
	margin-right: 10px;
	cursor: pointer;
}

.user-dropdown {
	padding-top: 9px;
	padding-right: 20px;
}
</style>