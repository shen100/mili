<template>
	<div class="golang-top-header">
		<div class="golang-top-box">
			<div class="golang-top-header-left">
				<div class="golang-logo-container">
                    <a href="/"><img src="~assets/images/logo.png" alt=""></a>
				</div>
				<div class="golang-header-search">
					<form action="" class="golang-top-search">
						<input type="text" class="golang-top-input" name="topSearch">
					</form>
				</div>
			</div>
			<div class="golang-top-header-right">
				<ul>
					<li>首页</li>
					<li>新手入门</li>
					<li>API</li>
					<li>关于</li>
                    <template v-if="userStatus">
                        <li>退出</li>
                    </template>
					<template v-else>
						<a href="/signup"><li>注册</li></a>
						<a href="/signin"><li>登陆</li></a>
					</template>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
    export default {
        props: [
            'userStatus'
        ],
        data () {
            return {
            }
        },
        mounted () {
            console.log(this.userStatus)
        }
    }
</script>
