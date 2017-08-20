<template>
    <div class="golang-home-body-right">
        <template v-if="!user && userLoginVisible">
            <div class="golang-cell golang-user-info">
                <p>golang中文社区</p>
                <p>您可以<a class="golang-user-info-action" href="/signin">登录</a>或<a class="golang-user-info-action" href="/signup">注册</a></p>
            </div>
        </template>
        <div v-if="user && pubTopic" class="golang-user-publish">
            <a href="/topic/create"><button class="signup-button ivu-btn ivu-btn-primary ivu-btn-large">发布话题</button></a>
        </div>
        <div v-if="author" class="golang-cell">
            <div class="title">作者信息</div>
            <div class="golang-user-info" style="padding-top:16px;">
                <div>
                    <a class="golang-sidebar-icon-box">
                        <img class="golang-user-info-icon" :src="author.avatarURL" alt="">
                    </a>
                    <span class="golang-sidebar-info-box">
                        {{author.name}}
                    </span>
                </div>
                <div class="golang-user-line author-info-text">
                    积分: {{author.score}}
                </div>
                <div class="golang-user-line author-info-text text-italic">{{author.signature || '这家伙很懒，什么个性签名都没有留下'}}</div>
            </div>
        </div>
        <div v-if="recentArticles && recentArticles.length" class="golang-cell">
            <div class="title">作者近期话题</div>
            <ul>
                <li v-for="topic in recentArticles" class="golang-cell-item"><a :href="`/topic/${topic.id}`" class="sidebar-articles-title">{{topic.name}}</a></li>
            </ul>
        </div>
        <div v-if="maxComment" class="golang-cell">
			<div class="title">回复最多的话题</div>
			<ul>
				<li class="golang-cell-item" v-for="item in maxComment"><a :href="`/topic/${item.id}`" class="sidebar-articles-title">{{item.name}}</a></li>
			</ul>
        </div>
        <div v-if="score" class="golang-cell">
			<div class="title">积分榜<span>TOP 100>></span></div>
			<ul>
				<li v-for="item in score" class="golang-cell-item">
					<span class="golang-score-item">{{item.score}}</span>
					<span class="golang-score-item">{{item.name}}</span>
				</li>
			</ul>
        </div>
        <div v-if="maxBrowse" class="golang-cell">
			<div class="title">热门话题</div>
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
            'userLoginVisible',
            'score',
            'maxComment',
            'maxBrowse',
            'pubTopic',
            'author',
            'score',
            'maxComment',
            'recentArticles'
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
