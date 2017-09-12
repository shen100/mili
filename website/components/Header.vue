<template>
	<div class="golang-top-header">
		<div class="golang-top-box">
			<div class="golang-top-header-left">
				<div class="golang-logo-container">
                    <a href="/">Golang123</a>
				</div>
				<div class="golang-header-search">
					<form action="" class="golang-top-search">
						<input type="text" class="golang-top-input" name="topSearch">
					</form>
				</div>
			</div>
            <div class="golang-top-header-nav">
                <ul>
                    <li><a href="/">首页</a></li>
                    <li><a href="/vote">投票</a></li>
                    <li><a href="/timeline">成长历史</a></li>
                    <li><a href="/about">关于</a></li>
                </ul>
            </div>
			<div class="golang-top-header-right">
				<ul>
                    <li><a href="https://github.com/shen100/golang123" target="_blank">golang123源码</a></li>
                    <li><a href="https://github.com/shen100/golang123/issues" target="_blank">问题反馈</a></li>
                    <template v-if="userData">
                        <li @click="onSignout">退出</li>
                    </template>
					<template v-else>
						<a @click="onSignin"><li>登录</li></a>
                        <a href="/signup"><li>注册</li></a>
					</template>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
    import request from '~/net/request'
    import ErrorCode from '~/constant/ErrorCode'
    import '~/utils/bd'

    export default {
        props: [
            'user'
        ],
        data () {
            return {
                userData: this.user
            }
        },
        methods: {
            onSignin () {
                location.href = '/signin?ref=' + encodeURIComponent(location.href)
            },
            onSignout () {
                request
                    .logout()
                    .then(res => {
                        if (res.errNo === ErrorCode.SUCCESS) {
                            this.userData = null
                            window.location.href = '/signin'
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        mounted () {
        }
    }
</script>
