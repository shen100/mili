<template>
	<Form>
		<Form-item
			label="标签树："
			:label-width="80">
			<Tree :data="baseData" show-checkbox></Tree>
		</Form-item>
	</Form>
</template>

<script>
	export default {
		data() {
			return {
				baseData: [
					{
						title: '<span>全部</span>',
					},
					{
						title: '<span>精华</span>',
					},
					{
						title: '<span>分享</span>',
					},
					{
						title: '<span>问答</span>',
					},
					{
						title: '<span>招聘</span>'
					}
                ]
			}
		}
	}
</script>