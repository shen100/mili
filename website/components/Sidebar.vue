<template>
    <div class="golang-home-body-right">
        <div class="golang-user-info">
	        <template v-if="userStatus">
				<p>golang123：golang专业中文社区</p>
				<p>您可以<a class="golang-user-info-action" href="/signin">登录</a>或<a class="golang-user-info-action" href="/signup">注册</a></p>
			</template>
			<template v-else>
				<div>
					<div class="golang-sidebar-icon-box">
						<img class="golang-user-info-icon" src="~assets/images/head.png" alt="">
					</div>
					<div class="golang-sidebar-info-box">
						<p>您好！ {{user.name}}</p>
					</div>
				</div>
				<div class="golang-user-line">
					<a href="/change/pwd" class="golang-common-link link-block">修改密码</a>
					<a href="" class="golang-common-link link-block">忘记密码</a>
				</div>
			</template>
        </div>
        <div class="golang-cell">
			<div class="title">回复最多的话题</div>
			<ul>
				<li class="golang-cell-item">今天是个好日子</li>
				<li class="golang-cell-item">今天是个好日子</li>
				<li class="golang-cell-item">今天是个好日子</li>
				<li class="golang-cell-item">今天是个好日子</li>
				<li class="golang-cell-item">今天是个好日子</li>
			</ul>
        </div>
        <div class="golang-cell">
			<div class="title">积分榜<span>TOP 100>></span></div>
			<ul>
				<li v-for="item in score" class="golang-cell-item">
					<span class="golang-score-item">{{item.score}}</span>
					<span class="golang-score-item">{{item.name}}</span>
				</li>
			</ul>
        </div>
        <div class="golang-cell">
			<div class="title">友情社区</div>
			<ul>
				<li class="golang-cell-item">今天是个好日子</li>
				<li class="golang-cell-item">今天是个好日子</li>
				<li class="golang-cell-item">今天是个好日子</li>
				<li class="golang-cell-item">今天是个好日子</li>
				<li class="golang-cell-item">今天是个好日子</li>
			</ul>
        </div>
    </div>
</template>

<script>
    export default {
        props: [
            'userStatus',
            'user',
            'score'
        ],
        data () {
            return {
            }
        }
    }
</script>

<style>

</style>
