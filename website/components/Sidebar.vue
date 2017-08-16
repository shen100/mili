<template>
    <div class="golang-home-body-right">
        <template v-if="user">
            <div class="golang-cell" style="margin-bottom:0;">
                <div class="title">个人信息</div>
            </div>
            <div class="golang-user-info">
    				<div>
    					<a class="golang-sidebar-usericon golang-sidebar-icon-box">
    						<img class="golang-user-info-icon" src="~assets/images/head.png" alt="">
    					</a>
    					<span class="golang-sidebar-info-box">
    						{{user.name}}
    					</span>
    				</div>
    				<div class="golang-user-line user-info-text user-info-score">
    					积分: {{user.score}}
    				</div>
                    <div class="golang-user-line user-info-text text-italic user-info-signature">{{user.signature || '这家伙很懒，什么个性签名都没有留下'}}</div>
            </div>
        </template>
        <template v-else>
            <div class="golang-cell golang-user-info">
                <p>golang中文社区</p>
                <p>您可以<a class="golang-user-info-action" href="/signin">登录</a>或<a class="golang-user-info-action" href="/signup">注册</a></p>
            </div>
        </template>
        <div class="golang-user-publish" v-if="user">
            <a href="/topic/create"><button class="signup-button ivu-btn ivu-btn-primary ivu-btn-large">发布话题</button></a>
        </div>
        <div class="golang-cell">
			<div class="title">回复最多的话题</div>
			<ul>
				<li class="golang-cell-item" v-for="item in maxComment"><a :href="`/topic/${item.id}`" class="sidebar-articles-title">{{item.name}}</a></li>
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
			<div class="title">浏览最多的话题</div>
			<ul>
				<li class="golang-cell-item" v-for="item in maxBrowse"><a :href="`/topic/${item.id}`" class="sidebar-articles-title">{{item.name}}</a></li>
			</ul>
        </div>
    </div>
</template>

<script>
    export default {
        props: [
            'user',
            'score',
            'maxComment',
            'maxBrowse'
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
