<template>
    <div class="golang-home-body-right">
        <div class="golang-user-info">
			<template v-if="userStatus">
				<div>
					<a class="golang-sidebar-icon-box">
						<img class="golang-user-info-icon" src="~assets/images/head.png" alt="">
					</a>
					<span class="golang-sidebar-info-box">
						{{user.name}}
					</span>
				</div>
				<div class="golang-user-line user-info-text">
					积分: 25
				</div>
                <div class="golang-user-line user-info-text text-italic">"这家伙很懒，什么个性签名都没有留下"</div>    
			</template>
            <template v-else>
                <p>golang123：golang专业中文社区</p>
                <p>您可以<a class="golang-user-info-action" href="/signin">登录</a>或<a class="golang-user-info-action" href="/signup">注册</a></p>
            </template>
        </div>
        <div class="golang-user-info" v-if="userStatus">
            <a href="/topic/create"><button class="signup-button ivu-btn ivu-btn-primary ivu-btn-large">发布话题</button></a>
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
        },
        mounted () {
            console.log(this.user)
        }
    }
</script>

<style>

</style>
